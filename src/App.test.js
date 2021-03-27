import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

afterEach(cleanup)

test('should take a snapshot', () => {
  const { asFragment } = render(<App />)
  expect(asFragment(<App />)).toMatchSnapshot()
});