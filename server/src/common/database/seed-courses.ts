import { DataSource } from 'typeorm';
import { AppDataSource } from './typeorm.config';
import { Subject } from '../entities/subject.entity';
import { Teacher } from '../entities/teacher.entity';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { Chapter } from '../entities/chapter.entity';
import { Content } from '../entities/content.entity';
import { Level, ContentType, Role } from '../entities/enums';

interface ChapterBlueprint {
  title: string;
  description: string;
}

interface CourseBlueprint {
  title: string;
  description: string;
  level: Level;
  tags: string[];
  thumbnail: string;
  chapters: ChapterBlueprint[];
}

const VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

function course(subjectName: string, slug: string, title: string, description: string, level: Level, tags: string[], chapters: [string, string][]): CourseBlueprint {
  return {
    title,
    description,
    level,
    tags,
    thumbnail: `https://picsum.photos/seed/${slug}/640/360`,
    chapters: chapters.map(([chTitle, chDesc]) => ({ title: chTitle, description: chDesc })),
  };
}

const BLUEPRINTS: Record<string, CourseBlueprint[]> = {
  'Mathematics': [
    course('Mathematics', 'algebra-foundations', 'Algebra Foundations', 'Build a strong base in algebra: variables, expressions and solving equations step by step.', Level.BEGINNER, ['algebra', 'equations', 'fundamentals'], [
      ['Variables & Expressions', 'Learn how letters represent numbers and how to build and simplify algebraic expressions.'],
      ['Solving Linear Equations', 'Isolate the variable and solve one-step and multi-step linear equations.'],
      ['Quadratic Equations', 'Factor, complete the square and use the discriminant to solve quadratics.'],
    ]),
    course('Mathematics', 'geometry-essentials', 'Geometry Essentials', 'From points and lines to area and volume, master the shapes that surround us.', Level.INTERMEDIATE, ['geometry', 'shapes', 'measurement'], [
      ['Points, Lines & Angles', 'Explore the building blocks of geometry and the relationships between angles.'],
      ['Triangles & Circles', 'Congruence, similarity and the key theorems of triangles and circles.'],
      ['Area & Volume', 'Compute perimeter, area and volume for common 2D and 3D figures.'],
    ]),
  ],
  'Physics': [
    course('Physics', 'mechanics-basics', 'Mechanics: Motion & Forces', 'Understand how things move: kinematics, Newton’s laws and energy.', Level.BEGINNER, ['mechanics', 'newton', 'energy'], [
      ['Describing Motion', 'Position, velocity and acceleration with graphs and equations.'],
      ["Newton's Laws", 'Force, mass and the three laws that govern every motion.'],
      ['Work & Energy', 'Kinetic and potential energy, conservation and power.'],
    ]),
    course('Physics', 'electricity-magnetism', 'Electricity & Magnetism', 'Circuits, fields and the forces that light up the modern world.', Level.ADVANCED, ['electricity', 'magnetism', 'circuits'], [
      ['Electric Charge & Fields', 'Coulomb’s law and the behavior of electric fields.'],
      ['Current & Circuits', 'Ohm’s law, series and parallel circuits, and power dissipation.'],
      ['Magnetic Forces', 'Magnetic fields, induction and the motor effect.'],
    ]),
  ],
  'Chemistry': [
    course('Chemistry', 'atomic-structure', 'Atomic Structure & The Periodic Table', 'Discover the atom and organize the elements like a chemist.', Level.BEGINNER, ['atoms', 'periodic-table', 'electrons'], [
      ['The Structure of the Atom', 'Protons, neutrons, electrons and isotopes.'],
      ['Electron Configuration', 'Shells, orbitals and how electrons fill the atom.'],
      ['Reading the Periodic Table', 'Groups, periods and periodic trends.'],
    ]),
    course('Chemistry', 'chemical-reactions', 'Chemical Reactions & Stoichiometry', 'Balance equations and count atoms with the mole.', Level.INTERMEDIATE, ['reactions', 'mole', 'stoichiometry'], [
      ['Balancing Equations', 'Conservation of mass and writing balanced equations.'],
      ['The Mole Concept', 'Avogadro’s number and molar calculations.'],
      ['Types of Reactions', 'Synthesis, decomposition, combustion and replacement.'],
    ]),
  ],
  'Biology': [
    course('Biology', 'cell-biology', 'Cell Biology', 'Tour the cell: organelles, membranes and the machinery of life.', Level.BEGINNER, ['cells', 'organelles', 'membranes'], [
      ['Inside the Cell', 'Nucleus, mitochondria, ribosomes and other organelles.'],
      ['The Cell Membrane', 'Structure and transport across the membrane.'],
      ['Cell Division', 'Mitosis, meiosis and the cell cycle.'],
    ]),
    course('Biology', 'genetics-intro', 'Introduction to Genetics', 'How traits pass from parents to offspring, from Mendel to DNA.', Level.INTERMEDIATE, ['genetics', 'dna', 'heredity'], [
      ["Mendel's Laws", 'Dominance, segregation and inheritance patterns.'],
      ['DNA & Genes', 'The double helix, replication and gene expression.'],
      ['Inheritance Problems', 'Punnett squares and pedigree analysis.'],
    ]),
  ],
  'Science': [
    course('Science', 'scientific-method', 'The Scientific Method', 'Ask questions, run experiments and think like a scientist.', Level.BEGINNER, ['experiments', 'hypothesis', 'measurement'], [
      ['Observation & Hypothesis', 'Turning curiosity into testable predictions.'],
      ['Designing Experiments', 'Variables, controls and fair testing.'],
      ['Analyzing Data', 'Tables, graphs and drawing valid conclusions.'],
    ]),
    course('Science', 'earth-space', 'Earth & Space', 'Rocks, weather and the solar system in one journey.', Level.BEGINNER, ['earth', 'space', 'solar-system'], [
      ['The Earth System', 'Layers of the Earth, plate tectonics and the rock cycle.'],
      ['Weather & Climate', 'The water cycle, atmosphere and climate patterns.'],
      ['The Solar System', 'Planets, moons, and our place in space.'],
    ]),
  ],
  'English': [
    course('English', 'grammar-mastery', 'English Grammar Mastery', 'Clean, confident writing through the core rules of English grammar.', Level.BEGINNER, ['grammar', 'writing', 'tenses'], [
      ['Parts of Speech', 'Nouns, verbs, adjectives and friends in context.'],
      ['Tenses Made Simple', 'Past, present and future in all their forms.'],
      ['Sentence Structure', 'Clauses, punctuation and avoiding common errors.'],
    ]),
    course('English', 'essay-writing', 'Essay Writing & Comprehension', 'Plan, draft and polish essays while reading texts with understanding.', Level.ADVANCED, ['essays', 'reading', 'analysis'], [
      ['Building a Thesis', 'Turning a prompt into a clear argument.'],
      ['Paragraph Development', 'Topic sentences, evidence and cohesion.'],
      ['Reading Comprehension', 'Skimming, scanning and critical interpretation.'],
    ]),
  ],
  'Arabic': [
    course('Arabic', 'arabic-reading', 'قراءة اللغة العربية', 'مهارات القراءة والفهم مع نصوص متدرجة المستوى.', Level.BEGINNER, ['reading', 'vocabulary'], [
      ['الحروف والكلمات', 'التعرف على الحركات والسواكن وقراءة الكلمات.'],
      ['الجمل البسيطة', 'قراءة جلة قصيرة وفهم المعنى العام.'],
      ['نصوص متدرجة', 'قراءة فقرات والإجابة عن أسئلة الفهم.'],
    ]),
    course('Arabic', 'arabic-grammar', 'النحو العربي المبسط', 'مدخل إلى إعراب الجملة الاسمية والفعلية بأسلوب سهل.', Level.INTERMEDIATE, ['grammar', 'nahw'], [
      ['الجملة الاسمية', 'المبتدأ والخبر وحالات الإعراب.'],
      ['الجملة الفعلية', 'الفعل والفاعل والمفعول به.'],
      ['المرفوعات والمنصوبات', 'قاعدة سريعة للنواصب والجوازم.'],
    ]),
  ],
  'Islamic education': [
    course('Islamic education', 'quran-basics', 'Quran Recitation Basics', 'Learn the etiquette of recitation and correct pronunciation of short surahs.', Level.BEGINNER, ['quran', 'tajweed'], [
      ['Etiquette of the Quran', 'Intention, wudu and respecting the mushaf.'],
      ['Tajweed Fundamentals', 'Makharij of the letters and basic rules.'],
      ['Short Surahs', 'Guided recitation of Al-Mulk and Al-Kahf passages.'],
    ]),
    course('Islamic education', 'fiqh-daily-life', 'Fiqh in Daily Life', 'Practical rulings for worship and everyday matters.', Level.INTERMEDIATE, ['fiqh', 'worship'], [
      ['Purification & Prayer', 'Conditions, pillars and common mistakes in salah.'],
      ['Fasting & Zakat', 'Rules of Ramadan and calculating zakat.'],
      ['Ethics & Transactions', 'Honesty in dealings and everyday adab.'],
    ]),
  ],
  'History': [
    course('History', 'world-civilizations', 'World Civilizations', 'From Mesopotamia to the modern era, the story of human societies.', Level.BEGINNER, ['civilizations', 'ancient-history'], [
      ['The First Cities', 'Mesopotamia, Egypt and the birth of writing.'],
      ['Classical Empires', 'Greece, Rome, Persia and Han China.'],
      ['The Islamic Golden Age', 'Science, trade and culture from Baghdad to Cordoba.'],
    ]),
    course('History', 'modern-history', 'Modern World History', 'Revolutions, world wars and the making of the contemporary world.', Level.ADVANCED, ['modern', 'wars', 'revolutions'], [
      ['Revolutions', 'American, French and industrial change.'],
      ['The World Wars', 'Causes, turning points and consequences.'],
      ['Post-War Order', 'Decolonization, the Cold War and globalization.'],
    ]),
  ],
  'Geography': [
    course('Geography', 'physical-geography', 'Physical Geography', 'Landforms, rivers and climates shaped by natural forces.', Level.BEGINNER, ['landforms', 'climate'], [
      ['Reading Maps', 'Coordinates, scale and map symbols.'],
      ['Rocks & Landforms', 'Weathering, erosion and famous landforms.'],
      ['Climate Zones', 'What drives weather and world climate patterns.'],
    ]),
    course('Geography', 'human-geography', 'Human & Economic Geography', 'Population, migration and the global economy on the map.', Level.INTERMEDIATE, ['population', 'economy', 'migration'], [
      ['Population Patterns', 'Growth, density and demographic transition.'],
      ['Migration & Cities', 'Why people move and how cities grow.'],
      ['Resources & Trade', 'Where goods come from and where they go.'],
    ]),
  ],
  'Philosophy': [
    course('Philosophy', 'great-questions', 'The Great Questions', 'An invitation to philosophy through timeless human questions.', Level.BEGINNER, ['ethics', 'logic', 'socratic'], [
      ['The Socratic Method', 'Questioning assumptions and thinking clearly.'],
      ['Logic & Arguments', 'Premises, conclusions and common fallacies.'],
      ['What Is a Good Life?', 'Happiness, virtue and meaning across traditions.'],
    ]),
    course('Philosophy', 'ethics-intro', 'Introduction to Ethics', 'Moral theories applied to real dilemmas.', Level.ADVANCED, ['ethics', 'morality'], [
      ['Consequentialism', 'Utilitarianism and its critics.'],
      ['Duty & Rights', 'Kantian ethics and human rights.'],
      ['Applied Ethics', 'Medicine, technology and environmental dilemmas.'],
    ]),
  ],
  'Arts and Crafts': [
    course('Arts and Crafts', 'drawing-fundamentals', 'Drawing Fundamentals', 'Line, shape, value and perspective from your first sketch.', Level.BEGINNER, ['drawing', 'sketching'], [
      ['Lines & Shapes', 'Control, confidence and the basic vocabulary.'],
      ['Light & Shadow', 'Value scales and rendering simple forms.'],
      ['Perspective', 'One and two-point perspective in practice.'],
    ]),
    course('Arts and Crafts', 'calligraphy-art', 'The Art of Calligraphy', 'Beautiful lettering with Arabic and Latin scripts.', Level.INTERMEDIATE, ['calligraphy', 'lettering'], [
      ['Tools & Strokes', 'Pens, inks and the pressure of the line.'],
      ['Arabic Scripts', 'Naskh and Thuluth letter proportions.'],
      ['Composition', 'Layout, balance and finishing your piece.'],
    ]),
  ],
  'Social Studies': [
    course('Social Studies', 'citizenship-basics', 'Citizenship & Community', 'Rights, responsibilities and how communities work.', Level.BEGINNER, ['citizenship', 'community'], [
      ['Me & My Community', 'Roles, institutions and civic participation.'],
      ['Rights & Responsibilities', 'What freedom and duty look like together.'],
      ['Decision Making', 'How groups solve problems fairly.'],
    ]),
    course('Social Studies', 'economics-everyday', 'Economics in Everyday Life', 'Money, markets and choices explained simply.', Level.INTERMEDIATE, ['economics', 'money', 'markets'], [
      ['Needs, Wants & Budgets', 'Personal finance basics.'],
      ['Markets & Prices', 'Supply, demand and why things cost what they do.'],
      ['Global Economy', 'Trade, jobs and money around the world.'],
    ]),
  ],
};

function quizForChapter(chapter: ChapterBlueprint, subjectName: string) {
  return [
    {
      question: `In "${chapter.title}", what is the main learning goal?`,
      options: [
        `Mastering the core ideas of ${chapter.title.toLowerCase()}`,
        'Memorizing unrelated facts',
        'Skipping practice entirely',
        'Avoiding any assessment',
      ],
      answerIndex: 0,
    },
    {
      question: `Which study habit best reinforces this ${subjectName} chapter?`,
      options: [
        'Regular practice and review',
        'Guessing on every question',
        'Ignoring feedback',
        'Skipping the exercises',
      ],
      answerIndex: 0,
    },
  ];
}

export async function seedCourses(dataSource: DataSource) {
  const subjectRepo = dataSource.getRepository(Subject);
  const teacherRepo = dataSource.getRepository(Teacher);
  const userRepo = dataSource.getRepository(User);
  const courseRepo = dataSource.getRepository(Course);
  const chapterRepo = dataSource.getRepository(Chapter);
  const contentRepo = dataSource.getRepository(Content);

  const subjects = await subjectRepo.find();
  const teachers = await teacherRepo.find();
  const admin = await userRepo.findOne({ where: { role: Role.ADMIN } });
  const fallbackUser = admin ?? (await userRepo.find({ take: 1 }))?.[0];

  if (!subjects.length || !fallbackUser) {
    console.log('No subjects/users found — run the main seed first, then seed courses.');
    return;
  }

  let created = 0;
  let videoIdx = 0;

  for (const [subjectName, courses] of Object.entries(BLUEPRINTS)) {
    const subject = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase());
    if (!subject) {
      console.log(`Subject not found, skipping: ${subjectName}`);
      continue;
    }

    const teacher = teachers.find((t) => t.subjectId === subject.id);
    const teacherUser = teacher ? await userRepo.findOne({ where: { id: teacher.userId } }) : null;
    const instructor = teacherUser?.fullname ?? fallbackUser.fullname;
    const ownerId = teacherUser?.id ?? fallbackUser.id;

    for (const bp of courses) {
      const existing = await courseRepo.findOne({ where: { title: bp.title } });
      if (existing) continue;

      const course = courseRepo.create({
        title: bp.title,
        description: bp.description,
        instructor,
        level: bp.level,
        tags: bp.tags,
        thumbnail: bp.thumbnail,
        price: 0,
        published: true,
        subjectId: subject.id,
        userId: ownerId,
        duration: 0,
      });
      await courseRepo.save(course);

      let courseDuration = 0;

      for (let chIdx = 0; chIdx < bp.chapters.length; chIdx++) {
        const chBp = bp.chapters[chIdx];

        const chapter = chapterRepo.create({
          title: chBp.title,
          description: chBp.description,
          order: chIdx,
          courseId: course.id,
          duration: 0,
        });
        await chapterRepo.save(chapter);

        let chapterDuration = 0;

        const videoLesson = {
          type: ContentType.VIDEO as const,
          title: chBp.title,
          order: 0,
          duration: 8 + ((chIdx * 3) % 8),
          url: VIDEO_URLS[videoIdx++ % VIDEO_URLS.length],
        };
        chapterDuration += videoLesson.duration;

        const textLesson = {
          type: ContentType.TEXT as const,
          title: `Notes: ${chBp.title}`,
          order: 1,
          duration: 5 + (chIdx % 4),
          text:
            `${chBp.description} In this ${subject.name} lesson, take your time with the worked examples, ` +
            `pause to summarize each section in your own words, and finish the practice questions at the end. ` +
            `A short recap: ${chBp.title.toLowerCase()} is foundational for the chapters that follow, so revisit these notes before the quiz.`,
        };
        chapterDuration += textLesson.duration;

        const quizLesson = {
          type: ContentType.QUIZ as const,
          title: `Quiz: ${chBp.title}`,
          order: 2,
          duration: 5,
          questions: quizForChapter(chBp, subject.name),
        };
        chapterDuration += quizLesson.duration;

        const lessons = [videoLesson, textLesson, quizLesson];
        for (const lesson of lessons) {
          const { title, order, type, ...rest } = lesson;
          const content = contentRepo.create({
            type,
            title,
            order,
            chapterId: chapter.id,
            data: { ...rest },
          });
          await contentRepo.save(content);
        }

        chapter.duration = chapterDuration;
        await chapterRepo.save(chapter);
        courseDuration += chapterDuration;
      }

      course.duration = courseDuration;
      await courseRepo.save(course);
      created++;
      console.log(`Created course: ${course.title} (${subject.name})`);
    }
  }

  console.log(created > 0 ? `Seeded ${created} courses.` : 'Courses already seeded.');
}

if (require.main === module) {
  AppDataSource.initialize()
    .then((ds) => seedCourses(ds))
    .then(async () => AppDataSource.destroy())
    .catch((err) => {
      console.error('Course seeding failed:', err);
      process.exit(1);
    });
}
