import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, confirmPassword, ...rest } = signUpDto;

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    await this.cacheService.invalidateByTag('user');

    const { password: _, ...result } = savedUser;
    return result;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...result } = user;
    return { user: result, accessToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const cacheKey = this.cacheService.generateEntityCacheKey('user', email);

    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.userRepository.findOne({ where: { email } });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['user'] })
      .then(async (user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }
        return user;
      });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = Math.random().toString(36).substring(2);
    await this.cacheService.set(
      `reset-password:${forgotPasswordDto.email}`,
      token,
      { ttl: 60 * 60, tags: ['password-reset'] },
    );

    return { message: 'Token sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, token, password, confirmPassword } = resetPasswordDto;

    const storedToken = await this.cacheService.get<string>(`reset-password:${email}`);

    if (storedToken !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.update({ email }, { password: hashedPassword });
    await this.cacheService.delete(`reset-password:${email}`);
    await this.cacheService.invalidateByTag('user');

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const cacheKey = this.cacheService.generateEntityCacheKey('user', userId);
    const user = await this.cacheService.getOrSet(cacheKey, async () => {
      return this.userRepository.findOne({ where: { id: userId } });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['user'] });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...result } = user;
    return result;
  }
}