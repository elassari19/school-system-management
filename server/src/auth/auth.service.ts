import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
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
    await this.redisService.clearCachePattern('course:*');

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
    const cacheKey = `user:${email}`;
    const cachedUser = await this.redisService.getCache<User>(cacheKey);

    let user: User | null = null;
    if (cachedUser) {
      user = cachedUser;
    } else {
      user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        await this.redisService.setCache(cacheKey, user, 60);
      }
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = Math.random().toString(36).substring(2);
    await this.redisService.setCache(
      `reset-password:${forgotPasswordDto.email}`,
      token,
      60 * 60,
    );

    return { message: 'Token sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, token, password, confirmPassword } = resetPasswordDto;

    const storedToken = await this.redisService.getCache<string>(
      `reset-password:${email}`,
    );

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
    await this.redisService.clearCache(`reset-password:${email}`);

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...result } = user;
    return result;
  }
}