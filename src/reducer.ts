import type { Launch } from './types/launch';

export interface State {
  launches: Launch[];
  loading: boolean;
  error: string | null;
  selectedLaunch: Launch | null;
}

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Launch[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_LAUNCH'; payload: Launch }
  | { type: 'CLOSE_MODAL' };

export const initialState: State = {
  launches: [],
  loading: true,
  error: null,
  selectedLaunch: null,
};

export const reducer = (
  state: State,
  action: Action
): State => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        launches: action.payload,
        error: null,
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SELECT_LAUNCH':
      return {
        ...state,
        selectedLaunch: action.payload,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        selectedLaunch: null,
      };

    default:
      return state;
  }
};
