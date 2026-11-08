import { describe, it, expect, vi, afterEach } from 'vitest';

import { fetchLaunches } from './api';

describe('fetchLaunches', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('получает список запусков', async () => {
    const mockData = [
      {
        flight_number: 1,
        mission_name: 'Starlink 2',
        launch_year: '2020',
        details: null,
        rocket: {
          rocket_name: 'Falcon 9',
        },
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchLaunches();

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('выбрасывает ошибку при неудачном запросе', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(fetchLaunches()).rejects.toThrow(
      'Ошибка сервера: 500'
    );
  });

  it('проверяет формат полученных данных', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ launches: [] }),
      })
    );

    await expect(fetchLaunches()).rejects.toThrow(
      'Некорректный формат данных от сервера'
    );
  });
});