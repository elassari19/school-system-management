import {
  FindManyOptions,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

const COMPARISON_OPERATORS = new Set(['gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'not', 'isNull']);
const PATTERN_OPERATORS = new Set(['contains', 'startsWith', 'endsWith', 'mode']);

function tryParse(value: unknown): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function isOperatorObject(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value as Record<string, unknown>);
  return (
    keys.length > 0 &&
    keys.every((key) => COMPARISON_OPERATORS.has(key) || PATTERN_OPERATORS.has(key))
  );
}

function transformWhereValue(value: unknown): unknown {
  if (isOperatorObject(value)) {
    const ops = value as Record<string, any>;
    let result: unknown = ops.eq ?? undefined;

    if (ops.contains !== undefined) {
      const pattern = `%${ops.contains}%`;
      result = ops.mode === 'insensitive' ? ILike(pattern) : Like(pattern);
    } else if (ops.startsWith !== undefined) {
      const pattern = `${ops.startsWith}%`;
      result = ops.mode === 'insensitive' ? ILike(pattern) : Like(pattern);
    } else if (ops.endsWith !== undefined) {
      const pattern = `%${ops.endsWith}`;
      result = ops.mode === 'insensitive' ? ILike(pattern) : Like(pattern);
    } else if (ops.gt !== undefined) {
      result = MoreThan(ops.gt);
    } else if (ops.gte !== undefined) {
      result = MoreThanOrEqual(ops.gte);
    } else if (ops.lt !== undefined) {
      result = LessThan(ops.lt);
    } else if (ops.lte !== undefined) {
      result = LessThanOrEqual(ops.lte);
    } else if (ops.in !== undefined) {
      result = In(ops.in);
    } else if (ops.notIn !== undefined) {
      result = Not(In(ops.notIn));
    } else if (ops.isNull !== undefined) {
      result = ops.isNull ? IsNull() : undefined;
    }

    if (ops.not !== undefined) {
      const inner = transformWhereValue(ops.not);
      result = Not(inner as any);
    }

    return result;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return transformWhere(value as Record<string, unknown>);
  }

  return value;
}

function transformWhere(where: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(where)) {
    result[key] = transformWhereValue(value);
  }
  return result;
}

export function sanitizeFindQuery<T = any>(rawQuery: any): FindManyOptions<T> {
  const query = typeof rawQuery === 'string' ? tryParse(rawQuery) : { ...(rawQuery || {}) };
  const options: FindManyOptions = {};

  if (query.where) {
    options.where = transformWhere(tryParse(query.where)) as any;
  }

  const relations = tryParse(query.relations);
  if (Array.isArray(relations) && relations.length > 0) {
    options.relations = relations;
  }

  const select = tryParse(query.select);
  if (Array.isArray(select) && select.length > 0) {
    options.select = select.includes('id') ? select : ['id', ...select];
  }

  const order = tryParse(query.order ?? query.orderBy);
  if (order && typeof order === 'object') {
    options.order = order;
  }

  const skip = Number(tryParse(query.skip));
  if (Number.isFinite(skip) && skip >= 0) {
    options.skip = skip;
  }

  const take = Number(tryParse(query.take));
  if (Number.isFinite(take) && take > 0) {
    options.take = take;
  }

  return options;
}
