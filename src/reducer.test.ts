import { describe, it, expect } from 'vitest';

import {
  initialState,
  reducer,
} from './reducer';

import type { Launch } from './types/launch';

const mockLaunch: Launch = {
  flight_number: 1,
  mission_name: 'Starlink 2',
  launch_year: '2020',
  details: 'Test details',
  links: {
    mission_patch: 'test.png',
    mission_patch_small: 'test-small.png',
  },
  rocket: {
    rocket_name: 'Falcon 9',
  },
};

describe('reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(initialState.loading).toBe(true);
    expect(initialState.launches).toEqual([]);
  });

  it('сохраняет загруженные запуски', () => {
    const state = reducer(initialState, {
      type: 'FETCH_SUCCESS',
      payload: [mockLaunch],
    });

    expect(state.loading).toBe(false);
    expect(state.launches).toHaveLength(1);
    expect(state.launches[0].mission_name).toBe('Starlink 2');
  });

  it('обрабатывает ошибку загрузки', () => {
    const state = reducer(initialState, {
      type: 'FETCH_ERROR',
      payload: 'Failed to fetch',
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  it('открывает модальное окно', () => {
    const state = reducer(initialState, {
      type: 'SELECT_LAUNCH',
      payload: mockLaunch,
    });

    expect(state.selectedLaunch).toEqual(mockLaunch);
  });

  it('закрывает модальное окно', () => {
    const openedState = {
      ...initialState,
      selectedLaunch: mockLaunch,
    };

    const state = reducer(openedState, {
      type: 'CLOSE_MODAL',
    });

    expect(state.selectedLaunch).toBeNull();
  });
});