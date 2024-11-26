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

// async function classes() {
//   console.log("Starting seeding...");

//   for (let c = 1; c <= 7; c++) {
//     for (let k = 1; k <= 4; k++) {
//       const class_ = await prisma.class.create({
//         data: {
//           name: `Class ${c}-${k}`,
//         },
//       });
//       console.log(`Create ${class_.name} classe group is DONE`);
//     }
//   }
// }

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

conectStudentWithClass()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });