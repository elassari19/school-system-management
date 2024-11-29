const { PrismaClient, Role } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("44444444", 10);

  console.log("Starting seeding...");

  for (let n = 0; n < 493; n++) {
    // Generate parent
    const parent = {
      email: faker.internet.email(),
      fullname: faker.person.fullName(),
      phone: faker.phone.number(),
      password: hashedPassword,
      role: Role.PARENT,
      age: faker.number.int({ min: 28, max: 60 }),
      gender: faker.person.sex(),
      image: faker.image.avatar(),
      address: faker.location.streetAddress(true),
      salary: faker.number.float({
        min: 30000,
        max: 120000,
        precision: 0.01,
      }),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    };
    // insert parent
    const parenttUser = await prisma.user.create({
      data: parent,
    });

    if (!parenttUser.id) {
      console.log("error parent");
      throw "error create parent";
    }
    const newParent = await prisma.parent.create({
      data: {
        userId: parenttUser.id,
      },
    });
    for (let i = 0; i < Math.ceil(Math.random() * 4); i++) {
      // Generate parent child
      const student = {
        email: faker.internet.email(),
        fullname: faker.person.firstName() + " " + parent.fullname.split(" ").at(-1),
        phone: faker.phone.number(),
        password: hashedPassword,
        role: Role.STUDENT,
        age: faker.number.int({ min: 14 + i, max: 15 + i }),
        gender: faker.person.sex(),
        image: faker.image.avatar(),
        address: parent.address,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      };
      // insert parent child
      const studentdb = await prisma.user.create({
        data: student,
      });
      if (!studentdb.id) {
        console.log("error studentdb");
        throw "error create studentdb";
      }
      // create and connect student with user, parent and class
      const studentUser = await prisma.student.create({
        data: {
          user: { connect: { id: studentdb.id } },
          parent: { connect: { id: newParent.id } },
          class: { connect: { id: "6740aba521300f4af5f41d2d" } },
        },
      });
      if (!studentUser.id) {
        console.log("error studentUser");
        throw "error create studentUser";
      }
    }
    console.log("parent", parent.fullname);
  }
}

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function classes() {
  console.log("Starting seeding...");

  for (let c = 1; c <= 7; c++) {
    for (let k = 1; k <= 4; k++) {
      const class_ = await prisma.class.create({
        data: {
          name: `Class ${c}-${k}`,
        },
      });
      console.log(`Create ${class_.name} classe group is DONE`);
    }
  }
}

// classes()
// .catch((e) => {
//   console.error(e);
//   process.exit(1);
// })
// .finally(async () => {
//   await prisma.$disconnect();
// });

async function conectStudentWithClass() {
  const student = await prisma.student.findMany({
    where: {
      user: {
        age: 17,
      },
    },
    include: {
      user: true,
    },
    take: 210,
  });
  console.log("student", student.length);
  const classes = await prisma.class.findMany({
    where: { name: { endsWith: "4" } },
  });

  let row = 0;
  for (let i = 0; i < student.length; i++) {
    await prisma.student.update({
      where: { id: student[i].id },
      data: { class: { connect: { id: classes[row].id } } },
    });
    if (i !== 0 && i % 30 === 0) {
      row += 1;
      console.log("classes", classes[row], "row", row);
    }
  }
}

// conectStudentWithClass()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function createSubjects() {
  // subjects
  const subjects = [
    "Islamic education",
    "English",
    "Arabic",
    "Mathematics",
    "Science",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Phylosophy",
    "Arts and Crafts",
    "Social Studies",
  ];

  for (let subj = 0; subj < subjects.length; subj++) {
    const resp = await prisma.subject.create({
      data: {
        name: subjects[subj],
      },
    });
    if (!resp.id) {
      throw "error create subject";
    }
    console.log(`Create ${resp.name} subject is DONE`);
  }
}

// createSubjects()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function teacherRole() {
  const hashedPassword = await hash("44444444", 10);

  for (let teach = 0; teach < 56; teach++) {
    const teacher = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        fullname: faker.person.firstName() + " " + faker.person.lastName(),
        phone: faker.phone.number(),
        password: hashedPassword,
        role: Role.TEACHER,
        age: faker.number.int({ min: 28, max: 60 }),
        gender: faker.person.sex(),
        image: faker.image.avatar(),
        address: faker.location.streetAddress(true),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
    if (!teacher.id) {
      console.log("error teacher");
      throw "error create teacher";
    }
  }
}

// teacherRole()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function connectUserTeachers() {
  const users = await prisma.user.findMany({
    where: {
      role: Role.TEACHER,
    },
  });
  console.log("users", users.length);

  for (let i = 0; i < users.length; i++) {
    const newTeacher = await prisma.teacher.create({
      data: {
        user: { connect: { id: users[i].id } },
      },
    });
    console.log("newTeacher", newTeacher);
  }
}

// connectUserTeachers()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function teachersExpeEduc() {
  const subjects = await prisma.subject.findMany({});
  if (!subjects.length) {
    console.log("No subjects found. Please run the createSubjects() function first.");
    return;
  }

  const teachers = await prisma.user.findMany({
    where: { role: Role.TEACHER },
  });
  if (!teachers.length) {
    console.log("No teachers found. Please run the createTeachers() function first.");
    return;
  }

  let sub = 0;
  for (let teach = 0; teach < 56; teach++) {
    const education = await prisma.education.create({
      data: {
        school: faker.company.name(),
        degree: faker.number.int({ min: 92, max: 97 }),
        field: subjects[sub].name,
        image: faker.image.avatar(),
        from: faker.date.past({ years: teachers[teach].age - 19 }),
        to: faker.date.past({ years: teachers[teach].age - 23 }),
        teacherId: teachers[teach].id,
      },
    });
    if (!education.id) {
      console.log("error education");
      throw "error create education";
    }

    const experience = await prisma.experience.create({
      data: {
        company: faker.company.name(),
        position: subjects[sub].name,
        from: faker.date.past({
          years: teachers[teach].age > 33 ? teachers[teach].age - 28 : 1,
        }),
        to: faker.date.past({
          years: teachers[teach].age > 33 ? teachers[teach].age - 28 : 1,
        }),
        certificate: faker.image.avatar(),
        teacherId: teachers[teach].id,
      },
    });
    if (!experience.id) {
      console.log("error experience");
      throw "error create experience";
    }

    if (teach % subjects.length === 0) {
      sub += 1;
    }

    console.log("teacher connecting done");
  }
}

// teachersExpeEduc()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function teacherSubject() {
  const teachers = await prisma.teacher.findMany({});
  const subjects = await prisma.subject.findMany({});

  let sub = 0;
  for (let i = 0; i < teachers.length; i++) {
    const teacherSubjectClass = await prisma.teacher.update({
      where: { id: teachers[i].id },
      data: {
        subjectId: subjects[sub].id,
      },
    });
    if (!teacherSubjectClass.id) {
      console.log("error teacherSubjectClass");
      throw "error create teacherSubjectClass";
    }
    if (sub !== 0 && i % subjects.length === 0) {
      sub += 1;
    }
  }
}

// teacherSubject()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function teacherClass() {
  const teachers = await prisma.teacher.findMany({});
  const classes = await prisma.class.findMany({});

  let sub = 0;
  for (let i = 28; i < teachers.length; i++) {
    for (let j = 0; j < 4; j++) {
      const teacherClassConnection = await prisma.teacherClasses.create({
        data: {
          teacherId: teachers[i].id,
          classId: classes[j + sub].id,
        },
      });

      if (!teacherClassConnection.id) {
        console.log("error teacherSubjectClass");
        throw "error create teacherSubjectClass";
      }
    }
    sub += 4;
    console.log("Teacher connected to class: sub", sub);
  }
}

teacherClass()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
