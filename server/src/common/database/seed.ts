import { AppDataSource } from './typeorm.config';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { Parent } from '../entities/parent.entity';
import { Class } from '../entities/class.entity';
import { Subject } from '../entities/subject.entity';
import { Course } from '../entities/course.entity';
import { Chapter } from '../entities/chapter.entity';
import { Content } from '../entities/content.entity';
import { Exam } from '../entities/exam.entity';
import { Grade } from '../entities/grade.entity';
import { Payment } from '../entities/payment.entity';
import { Group } from '../entities/group.entity';
import { GroupMembership } from '../entities/group-membership.entity';
import { Education } from '../entities/education.entity';
import { Experience } from '../entities/experience.entity';
import { Session } from '../entities/session.entity';
import { Account } from '../entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { TeacherClasses } from '../entities/teacher-classes.entity';
import { SubjectClasses } from '../entities/subject-classes.entity';
import { Role, Level, ContentType, PaymentStatus } from '../entities/enums';
import * as bcrypt from 'bcryptjs';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const studentRepo = AppDataSource.getRepository(Student);
  const teacherRepo = AppDataSource.getRepository(Teacher);
  const parentRepo = AppDataSource.getRepository(Parent);
  const classRepo = AppDataSource.getRepository(Class);
  const subjectRepo = AppDataSource.getRepository(Subject);
  const courseRepo = AppDataSource.getRepository(Course);
  const chapterRepo = AppDataSource.getRepository(Chapter);
  const contentRepo = AppDataSource.getRepository(Content);
  const examRepo = AppDataSource.getRepository(Exam);
  const gradeRepo = AppDataSource.getRepository(Grade);
  const paymentRepo = AppDataSource.getRepository(Payment);
  const groupRepo = AppDataSource.getRepository(Group);
  const groupMembershipRepo = AppDataSource.getRepository(GroupMembership);
  const educationRepo = AppDataSource.getRepository(Education);
  const experienceRepo = AppDataSource.getRepository(Experience);
  const sessionRepo = AppDataSource.getRepository(Session);
  const accountRepo = AppDataSource.getRepository(Account);
  const verificationTokenRepo = AppDataSource.getRepository(VerificationToken);
  const teacherClassesRepo = AppDataSource.getRepository(TeacherClasses);
  const subjectClassesRepo = AppDataSource.getRepository(SubjectClasses);

  const hashedPassword = await bcrypt.hash('44444444', 10);

  console.log('Starting seeding...');

  // Create subjects
  const subjects = [
    'Islamic education',
    'English',
    'Arabic',
    'Mathematics',
    'Science',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Philosophy',
    'Arts and Crafts',
    'Social Studies',
  ];

  const createdSubjects: Subject[] = [];
  for (const subjectName of subjects) {
    const subject = subjectRepo.create({ name: subjectName });
    await subjectRepo.save(subject);
    createdSubjects.push(subject);
    console.log(`Created subject: ${subjectName}`);
  }

  // Create classes
  const createdClasses: Class[] = [];
  for (let c = 1; c <= 7; c++) {
    for (let k = 1; k <= 4; k++) {
      const cls = classRepo.create({ name: `Class ${c}-${k}` });
      await classRepo.save(cls);
      createdClasses.push(cls);
      console.log(`Created class: ${cls.name}`);
    }
  }

  // Create parent users and students
  for (let n = 0; n < 10; n++) {
    const parentUser = userRepo.create({
      email: `parent${n}@example.com`,
      fullname: `Parent ${n}`,
      phone: `555-000-${n.toString().padStart(4, '0')}`,
      password: hashedPassword,
      role: Role.PARENT,
      age: 35 + n,
      gender: n % 2 === 0 ? 'Male' : 'Female',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=parent${n}`,
      address: `Address ${n}`,
      salary: 50000 + n * 1000,
    });
    await userRepo.save(parentUser);

    const parent = parentRepo.create({ userId: parentUser.id });
    await parentRepo.save(parent);

    for (let i = 0; i < 2; i++) {
      const studentUser = userRepo.create({
        email: `student${n}-${i}@example.com`,
        fullname: `Student ${n}-${i} ${parentUser.fullname.split(' ').pop()}`,
        phone: `555-111-${(n * 10 + i).toString().padStart(4, '0')}`,
        password: hashedPassword,
        role: Role.STUDENT,
        age: 14 + i,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${n}-${i}`,
        address: parentUser.address,
      });
      await userRepo.save(studentUser);

      const student = studentRepo.create({
        userId: studentUser.id,
        parentId: parent.id,
        classId: createdClasses[Math.floor(Math.random() * createdClasses.length)].id,
        attendence: 92.5,
        status: 'Active',
      });
      await studentRepo.save(student);
    }
    console.log(`Created parent: ${parentUser.fullname} with 2 students`);
  }

  // Create teacher users
  for (let t = 0; t < 5; t++) {
    const teacherUser = userRepo.create({
      email: `teacher${t}@example.com`,
      fullname: `Teacher ${t}`,
      phone: `555-222-${t.toString().padStart(4, '0')}`,
      password: hashedPassword,
      role: Role.TEACHER,
      age: 30 + t,
      gender: t % 2 === 0 ? 'Male' : 'Female',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=teacher${t}`,
      address: `Teacher Address ${t}`,
    });
    await userRepo.save(teacherUser);

    const teacher = teacherRepo.create({
      userId: teacherUser.id,
      subjectId: createdSubjects[t % createdSubjects.length].id,
    });
    await teacherRepo.save(teacher);

    // Add education
    const education = educationRepo.create({
      school: `University ${t}`,
      degree: 95 + t,
      field: createdSubjects[t % createdSubjects.length].name,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=edu${t}`,
      teacherId: teacher.id,
      from: new Date('2015-01-01'),
      to: new Date('2019-01-01'),
    });
    await educationRepo.save(education);

    // Add experience
    const experience = experienceRepo.create({
      company: `School ${t}`,
      position: createdSubjects[t % createdSubjects.length].name,
      teacherId: teacher.id,
      from: new Date('2020-01-01'),
      to: new Date('2023-01-01'),
      certificate: `https://api.dicebear.com/7.x/avataaars/svg?seed=exp${t}`,
    });
    await experienceRepo.save(experience);
  }
  console.log('Created 5 teachers with education and experience');

  // Connect teachers to classes
  const teachers = await teacherRepo.find();
  for (let i = 0; i < teachers.length; i++) {
    for (let j = 0; j < 4; j++) {
      const classIndex = (i * 4 + j) % createdClasses.length;
      const tc = teacherClassesRepo.create({
        teacherId: teachers[i].id,
        classId: createdClasses[classIndex].id,
      });
      await teacherClassesRepo.save(tc);
    }
  }
  console.log('Connected teachers to classes');

  // Connect subjects to classes
  for (let i = 0; i < createdSubjects.length; i++) {
    for (let j = 0; j < 4; j++) {
      const classIndex = (i * 4 + j) % createdClasses.length;
      const sc = subjectClassesRepo.create({
        subjectId: createdSubjects[i].id,
        classId: createdClasses[classIndex].id,
      });
      await subjectClassesRepo.save(sc);
    }
  }
  console.log('Connected subjects to classes');

  // Create admin user
  const adminUser = userRepo.create({
    email: 'admin@example.com',
    fullname: 'Admin User',
    phone: '555-999-0000',
    password: hashedPassword,
    role: Role.ADMIN,
    age: 40,
    gender: 'Male',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    address: 'Admin Address',
  });
  await userRepo.save(adminUser);
  console.log('Created admin user');

  await AppDataSource.destroy();
  console.log('Seeding completed!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});