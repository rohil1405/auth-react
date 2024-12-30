import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom/client';
import App from './App';

const queryClient = new QueryClient();

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe('index.tsx', () => {
  it('should render without errors', () => {
    document.body.innerHTML = '<div id="root"></div>';
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByText(/your app content here/i)).toBeInTheDocument();

    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
  });

  it('should initialize QueryClientProvider with the correct client', () => {
    document.body.innerHTML = '<div id="root"></div>';

    const testQueryClient = new QueryClient();
    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByText(/your app content here/i)).toBeInTheDocument();
  });
});
