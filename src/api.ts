
import type { Launch } from './types/launch';

const API_URL = 'https://kata-spacex.onrender.com/api/launches';

export const fetchLaunches = async (
  signal?: AbortSignal
): Promise<Launch[]> => {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Некорректный формат данных от сервера');
  }

  return data as Launch[];
};
