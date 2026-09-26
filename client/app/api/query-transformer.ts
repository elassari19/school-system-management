export interface PrismaQuery {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean>;
  skip?: number;
  take?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  data?: Record<string, unknown>;
}

export interface TypeORMQuery {
  where?: Record<string, unknown>;
  relations?: string[];
  select?: string[];
  skip?: number;
  take?: number;
  order?: Record<string, 'ASC' | 'DESC'>;
  data?: Record<string, unknown>;
}

function flattenInclude(include: Record<string, unknown>, prefix = ''): string[] {
  const relations: string[] = [];
  
  for (const [key, value] of Object.entries(include)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    
    if (value === true) {
      relations.push(fullPath);
    } else if (typeof value === 'object' && value !== null) {
      const valueObj = value as Record<string, unknown>;
      if (valueObj.include) {
        relations.push(fullPath);
        relations.push(...flattenInclude(valueObj.include as Record<string, unknown>, fullPath));
      }
      if (valueObj.select) {
        relations.push(fullPath);
      }
    }
  }
  
  return relations;
}

function flattenSelect(select: Record<string, boolean>): string[] {
  return Object.entries(select)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
}

function transformOrderBy(orderBy: Record<string, 'asc' | 'desc'>): Record<string, 'ASC' | 'DESC'> {
  const order: Record<string, 'ASC' | 'DESC'> = {};
  for (const [key, value] of Object.entries(orderBy)) {
    order[key] = value.toUpperCase() as 'ASC' | 'DESC';
  }
  return order;
}

export function transformPrismaToTypeORM(query: PrismaQuery): TypeORMQuery {
  const typeormQuery: TypeORMQuery = {};
  
  if (query.where) {
    typeormQuery.where = query.where;
  }
  
  if (query.include) {
    typeormQuery.relations = flattenInclude(query.include);
  }
  
  if (query.select) {
    typeormQuery.select = flattenSelect(query.select);
  }
  
  if (query.skip !== undefined) {
    typeormQuery.skip = query.skip;
  }
  
  if (query.take !== undefined) {
    typeormQuery.take = query.take;
  }
  
  if (query.orderBy) {
    typeormQuery.order = transformOrderBy(query.orderBy);
  }
  
  if (query.data) {
    typeormQuery.data = query.data;
  }
  
  return typeormQuery;
}

export function transformUpdateQuery(query: PrismaQuery & { where: Record<string, unknown> }): TypeORMQuery {
  const transformed = transformPrismaToTypeORM(query);
  
  if (query.where) {
    transformed.where = query.where;
  }
  
  return transformed;
}

export function transformCreateQuery(query: PrismaQuery): TypeORMQuery {
  return transformPrismaToTypeORM(query);
}

export function transformDeleteQuery(query: PrismaQuery): TypeORMQuery {
  const typeormQuery: TypeORMQuery = {};
  
  if (query.where) {
    typeormQuery.where = query.where;
  }
  
  return typeormQuery;
}