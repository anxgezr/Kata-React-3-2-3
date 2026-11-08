
import { useCallback, useEffect, useReducer } from 'react';
import { Alert, Loader, Title } from '@mantine/core';

import { fetchLaunches } from './api';
import { initialState, reducer } from './reducer';
import type { Launch } from './types/launch';
import LaunchCard from './components/LaunchCard';
import LaunchModal from './components/LaunchModal';

import './App.scss';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const loadLaunches = async () => {
      dispatch({ type: 'FETCH_START' });

      try {
        const launches = await fetchLaunches(controller.signal);

        if (!controller.signal.aborted) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: launches,
          });
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          error instanceof Error ? error.message : 'Неизвестная ошибка';

        dispatch({
          type: 'FETCH_ERROR',
          payload: message,
        });
      }
    };

    loadLaunches();

    return () => controller.abort();
  }, []);

  const handleSelect = useCallback((launch: Launch) => {
  dispatch({
    type: 'SELECT_LAUNCH',
    payload: launch,
  });
}, []);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  return (
    <main className="page">
      <Title order={1} className="page-title">
        SpaceX Launches 2020
      </Title>

      {state.loading && (
        <div className="loading">
          <Loader size="lg" />
          <p>Загрузка запусков...</p>
        </div>
      )}

      {state.error && (
        <Alert
          color="red"
          title="Не удалось загрузить запуски"
          className="error-alert"
        >
          {state.error.toLowerCase().includes('failed to fetch') ||
          state.error.toLowerCase().includes('network') ? (
            <>
              Не удалось подключиться к серверу. Проверьте интернет-
              соединение. Возможно, необходимо включить VPN и обновить
              страницу.
            </>
          ) : (
            <>
              {state.error}. Проверьте подключение к интернету и попробуйте
              обновить страницу.
            </>
          )}
        </Alert>
      )}

      {!state.loading && !state.error && (
        <section className="launch-grid">
          {state.launches.map((launch) => (
            <LaunchCard
              key={launch.flight_number}
              launch={launch}
              onSelect={handleSelect}
            />
          ))}
        </section>
      )}

      {state.selectedLaunch && (
        <LaunchModal
          launch={state.selectedLaunch}
          onClose={handleClose}
        />
      )}
    </main>
  );
}
