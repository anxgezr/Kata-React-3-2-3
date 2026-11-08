import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';

import { MantineProvider } from '@mantine/core';
import App from '../App';

const mockLaunch = {
  flight_number: 1,
  mission_name: 'Starlink 2',
  launch_year: '2020',
  details: 'Mission test details',
  links: {
    mission_patch_small: 'small.png',
    mission_patch: 'large.png',
  },
  rocket: {
    rocket_name: 'Falcon 9',
  },
};

const renderApp = () =>
  render(
    <MantineProvider>
      <App />
    </MantineProvider>
  );

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('показывает список запусков', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLaunch]),
      })
    );

    renderApp();

    expect(screen.getByText('Загрузка запусков...')).toBeInTheDocument();

    expect(
      await screen.findByText('Starlink 2')
    ).toBeInTheDocument();

    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
  });

  it('открывает модальное окно по кнопке', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLaunch]),
      })
    );

    renderApp();

    const button = await screen.findByRole('button', {
      name: 'Посмотреть больше',
    });

    fireEvent.click(button);

    expect(
      screen.getByRole('dialog')
    ).toBeInTheDocument();

    expect(screen.getByText('Mission test details')).toBeInTheDocument();
  });

  it('закрывает модальное окно', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLaunch]),
      })
    );

    renderApp();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Посмотреть больше',
      })
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Закрыть' })
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('показывает уведомление при ошибке сети', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    );

    renderApp();

    expect(
      await screen.findByText(/возможно, необходимо включить VPN/i)
    ).toBeInTheDocument();
  });
});