# Prisma Queries examples

## Filter data based on connecting colums

```
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true },
  })
```

## Teachers and classes relationchip

```
  await prisma.teacherClasses.create({
    data: {
      teacherId: teacher.id,
      classId: class1.id,
    },
  });
```

### Fetch the teacher with their classes

```
  const teacherWithClasses = await prisma.teacher.findUnique({
    where: { id: teacher.id },
    include: { classes: true },
  });
```

### Fetch the classes with their teacher

```
  const teacherWithClasses = await prisma.class.findUnique({
    where: { id: teacher.id },
    include: { teachers: true },
  });
```
