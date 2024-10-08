import { Router } from 'express';
import {
  createChapter,
  deleteAllChapter,
  deleteChapter,
  getAllChapter,
  getChapter,
  updateChapter,
} from './chapter.controller';
import { isAdminOrTeacher } from '../../middelwares/passport.middelware';
import validateSchema from '../../middelwares/validateSchema';
import { chapterSchema } from './chapter.schema';

const router = Router();

router.get('/', getChapter);

router.get('/all', getAllChapter);

router.post(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(chapterSchema),
  createChapter
);

router.put(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(chapterSchema),
  updateChapter
);

router.delete(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteChapter
);

router.delete(
  '/all',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteAllChapter
);

export default router;
