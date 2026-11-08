import type { Launch } from './types/launch';

const API_URL = 'https://kata-spacex.onrender.com/api/launches';

export const fetchLaunches = async (
  signal?: AbortSignal
): Promise<Launch[]> => {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error('Сервер вернул некорректный JSON');
  }

  console.log('Ответ API:', data);
  console.log('Ответ является массивом:', Array.isArray(data));

  if (!Array.isArray(data)) {
    const receivedFormat =
      data !== null && typeof data === 'object'
        ? `объект с полями: ${Object.keys(data).join(', ')}`
        : typeof data;

    throw new Error(
      `Некорректный формат данных от сервера. Получен ${receivedFormat}`
    );
  }

  return data as Launch[];
};