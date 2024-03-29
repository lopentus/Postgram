import { render, screen } from './helpers/test-utils';
import App from './App';

test('renders welcome to postgram text', () => {
  render(<App />);
  const textElement = screen.getByText(/welcome to postgram/i);
  expect(textElement).toBeInTheDocument();
});
