import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '@contexts/App/AppContextProvider';
import CartContextProvider from '@contexts/Cart/CartContextProvider';
import App from '../src/App';

vi.mock('../src/AppRouter', () => ({
  __esModule: true,
  default: () => <div>Mocked AppRouter</div>,
}));

vi.mock('@contexts/App/AppContextProvider', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@contexts/Cart/CartContextProvider', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@contexts/App/AppContextProvider', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@contexts/Cart/CartContextProvider', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>, // eslint-disable-line
}));

describe('App', () => {
  it('default', async () => {
    const { getByText } = render(
      <AppContextProvider>
        <CartContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartContextProvider>
      </AppContextProvider>,
    );

    await waitFor(() => expect(getByText('Mocked AppRouter')).toBeInTheDocument());
  });
});