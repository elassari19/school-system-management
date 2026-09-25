# Migration Plan: Express → NestJS | MongoDB/Prisma → PostgreSQL/TypeORM

## Phase 1: Project Setup & Dependencies

**New `package.json` dependencies:**

Remove:
- `express`, `prisma`, `@prisma/client`, `@quixo3/prisma-session-store`
- `body-parser`, `morgan`, `passport`, `passport-local`
- `express-session`, `swagger-jsdoc`, `swagger-ui-express`

Add:
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- `@nestjs/typeorm`, `typeorm`, `pg`
- `@nestjs/passport`, `@nestjs/swagger`
- `@nestjs/config`, `reflect-metadata`
- `class-validator`, `class-transformer`

Keep:
- `bcryptjs`, `ioredis`, `stripe`, `joi` (or replace with `class-validator`)

Update:
- `typescript` → latest
- `@types/node` → latest
- `jest` → latest

**Update `tsconfig.json`:**
- Enable `experimentalDecorators: true` and `emitDecoratorMetadata: true` (required by NestJS/TypeORM)
- Change `module` to `CommonJS` (NestJS standard)

---

## Phase 2: Database Schema Migration (MongoDB → PostgreSQL + TypeORM)

**Replace `prisma/schema.prisma` with TypeORM entities.**

Key changes per model:
- `@id @default(auto()) @db.ObjectId` → `@PrimaryGeneratedColumn('uuid')`
- `String @db.ObjectId` foreign keys → `@ManyToOne`, `@OneToMany`, `@ManyToMany` decorators
- `Json` type → `jsonb` column type in PostgreSQL
- `String[]` arrays → `simple-array` or separate junction tables
- Enums stay the same but defined as TypeScript enums with `@Column({ type: 'enum' })`

Entities to create:
`User`, `Student`, `Teacher`, `Parent`, `Class`, `Subject`, `Course`, `Chapter`, `Content`, `Exam`, `Grade`, `Payment`, `Group`, `GroupMembership`, `Education`, `Experience`, `Session`, `Account`, `VerificationToken`

**Update `.env`:**
```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
REDIS_URL=redis://localhost:6379
SECRET_KEY=<session_secret>
STRIPE_SECRET_API_KEY=<stripe_key>
STRIPE_PRICE_ID=<stripe_price_id>
STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
CLIENT_URL=http://localhost:3000
PORT=3001
```

---

## Phase 3: NestJS Application Structure

Replace the Express `src/app/` structure with NestJS modules:

```
src/
  app.module.ts              ← root module (replaces src/app/index.ts)
  main.ts                    ← replaces src/server.ts
  auth/
    auth.module.ts
    auth.controller.ts       ← replaces auth.route.ts + auth.controller.ts
    auth.service.ts
    auth.guard.ts            ← replaces passport.middleware.ts
    local.strategy.ts        ← replaces strategies/local-strategy.ts
    dto/                     ← replaces auth.schema.ts (Joi → class-validator DTOs)
  user/
    user.module.ts
    user.controller.ts
    user.service.ts
    dto/
  student/
    student.module.ts
    student.controller.ts
    student.service.ts
    dto/
  teacher/
    teacher.module.ts
    teacher.controller.ts
    teacher.service.ts
  class/
    class.module.ts
    class.controller.ts
    class.service.ts
    dto/
  subject/
    subject.module.ts
    subject.controller.ts
    subject.service.ts
    dto/
  course/
    course.module.ts
    course.controller.ts
    course.service.ts
    dto/
  chapter/
    chapter.module.ts
    chapter.controller.ts
    chapter.service.ts
    dto/
  content/
    content.module.ts
    content.controller.ts
    content.service.ts
    dto/
  group/
    group.module.ts
    group.controller.ts
    group.service.ts
    dto/
  payment/
    payment.module.ts
    payment.controller.ts
    payment.service.ts
  common/
    redis/
      redis.service.ts       ← replaces utils/redisCache.ts
      redis.module.ts
    database/
      typeorm.config.ts      ← replaces utils/configs.ts (prisma part)
    guards/
      roles.guard.ts
    decorators/
      roles.decorator.ts
    filters/
      http-exception.filter.ts  ← replaces errorHandler middleware
    entities/                ← all TypeORM entity files
```

---

## Phase 4: Key Code Migrations

### `src/utils/configs.ts` → Split into:
- `src/common/database/typeorm.config.ts` — TypeORM `DataSource` config
- `src/common/redis/redis.service.ts` — injectable Redis service (keep `ioredis`)
- Stripe initialized as a NestJS provider

### Middleware → NestJS Guards/Interceptors:
| Express | NestJS |
|---|---|
| `isAuthenticated()` | `@UseGuards(AuthGuard('local'))` |
| `isAdminOrTeacher()` | `@UseGuards(RolesGuard)` + `@Roles('ADMIN', 'TEACHER')` |
| `validateSchema` (Joi) | `ValidationPipe` + `class-validator` DTOs |
| `errorHandler` | `HttpExceptionFilter` |
| `session.middleware.ts` | session config in `main.ts` with `connect-redis` |
| `notFound` | built-in NestJS 404 handling |

### Route controllers:
Each `*.route.ts` + `*.controller.ts` pair merges into a single NestJS `@Controller()`:

| Express | NestJS |
|---|---|
| `router.get('/', handler)` | `@Get() handler()` |
| `router.post('/', handler)` | `@Post() handler()` |
| `router.put('/', handler)` | `@Put() handler()` |
| `router.delete('/', handler)` | `@Delete() handler()` |
| `req.body` | `@Body()` |
| `req.query` | `@Query()` |
| `req.params` | `@Param()` |
| `res.status(201).json(data)` | `return data` + `@HttpCode(201)` |

### Swagger:
Replace `swagger-jsdoc` JSDoc comments with `@nestjs/swagger` decorators:
- `@ApiTags('auth')` on controllers
- `@ApiOperation({ summary: '...' })` on methods
- `@ApiResponse({ status: 201 })` on methods
- `@ApiProperty()` on DTO class properties

### Seed file:
Rewrite `prisma/seed.ts` to use TypeORM repositories instead of `PrismaClient`:
```ts
// Before (Prisma)
const user = await prisma.user.create({ data: {...} });

// After (TypeORM)
const userRepo = dataSource.getRepository(User);
const user = await userRepo.save(userRepo.create({...}));
```

---

## Phase 5: Testing Updates

- Replace `supertest` + manual `createApp()` with `@nestjs/testing` `Test.createTestingModule()`
- Replace `jest.mock('../../utils/configs', ...)` prisma mocks with TypeORM repository mocks using `getRepositoryToken(Entity)`
- Keep Jest as the test runner

Example mock pattern change:
```ts
// Before (Prisma mock)
jest.mock('../../utils/configs', () => ({
  prisma: { user: { findUnique: jest.fn() } },
}));

// After (TypeORM mock)
{
  provide: getRepositoryToken(User),
  useValue: { findOne: jest.fn(), save: jest.fn() },
}
```

---

## Phase 6: Config & Deployment Files

- **`ecosystem.config.js`** — update `script` to `dist/main.js` (NestJS compiles to `dist/`)
- **`vercel.json`** — update build command: remove `prisma generate`, point to `dist/main.js`
- **`README.md`** — update scripts: `npm run start:dev`, `npm run build`, `npm run migration:run`

Add TypeORM migration scripts to `package.json`:
```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "migration:generate": "typeorm migration:generate",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "seed": "ts-node src/common/database/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## Migration Order (Recommended)

1. Setup NestJS scaffold + TypeORM + PostgreSQL connection
2. Create all TypeORM entities from Prisma schema
3. Run initial migration to create tables
4. Migrate `auth` module first (most dependencies)
5. Migrate remaining modules in order:
   - `user`
   - `student`
   - `class`
   - `subject`
   - `course`
   - `chapter`
   - `content`
   - `group`
   - `payment`
6. Migrate Redis service (`utils/redisCache.ts` → `redis.service.ts`)
7. Update guards and middleware
8. Update Swagger docs
9. Update tests
10. Update deployment configs (`ecosystem.config.js`, `vercel.json`, `README.md`)
