import { EventFormType } from '../../lib/zod-schema';
import { createData, getData, getFirstData, updateData } from './services';

// event page
export async function getEventsQuery() {
  return await getData(
    {
      orderBy: { date: 'desc' },
    },
    'event'
  );
}

export async function getSearchEventsQuery(page: number, q: string) {
  return await getData(
    {
      where: { name: { contains: q, mode: 'insensitive' } },
      skip: page > 0 ? (page - 1) * 5 : 0,
      take: 5,
      orderBy: { date: 'desc' },
    },
    'event'
  );
}

export async function getEventQuery(id: string) {
  return await getFirstData(
    {
      where: { id },
      include: {
        createdBy: true,
      },
    },
    'event'
  );
}

export async function createEventQuery(data: EventFormType) {
  return await createData(
    {
      data: {
        name: data.name,
        date: new Date(data.date).toISOString(),
        location: data.location,
        type: data.type,
        description: data.description,
      },
    },
    'event'
  );
}

export async function updateEventQuery(data: EventFormType, id: string) {
  return await updateData(
    {
      where: { id },
      data: {
        name: data.name,
        date: new Date(data.date).toISOString(),
        location: data.location,
        type: data.type,
        description: data.description,
      },
    },
    'event'
  );
}
