import { AppDataSource } from './typeorm.config';
import { User } from '../entities/user.entity';
import { Role } from '../entities/enums';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existingUser = await userRepo.findOne({
    where: { email: 'elassari19@gmail.com' },
  });

  if (existingUser) {
    console.log('Admin user already exists');
    await AppDataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('44444444', 10);

  const adminUser = userRepo.create({
    email: 'elassari19@gmail.com',
    fullname: 'Admin User',
    phone: '555-999-0000',
    password: hashedPassword,
    role: Role.ADMIN,
    age: 40,
    gender: 'Male',
    address: 'Admin Address',
  });

  await userRepo.save(adminUser);
  console.log('Admin user created successfully!');
  console.log('Email: elassari19@gmail.com');
  console.log('Password: 44444444');
  console.log('Role: ADMIN');

  await AppDataSource.destroy();
}

createAdmin().catch((error) => {
  console.error('Failed to create admin user:', error);
  process.exit(1);
});