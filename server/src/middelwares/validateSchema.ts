import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

interface CustomRequest<T> extends Request {
  value?: T;
}

const validateSchema = (schema: ObjectSchema) => {
  return (req: CustomRequest<any>, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log('error', error);
      return res.status(403).json({ error: error.details });
    }
    req.value = value;
    next();
  };
};

export default validateSchema;
