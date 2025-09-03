import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BooksPage from '../BooksPage.jsx';

vi.mock('../../api/client.js', () => ({
  apiGet: vi.fn(() => Promise.resolve({ books: [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', status: 'Available' },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', status: 'Available' },
    { id: 3, title: '1984', author: 'George Orwell', category: 'Fiction', status: 'Lent' },
    { id: 4, title: 'Animal Farm', author: 'George Orwell', category: 'Fiction', status: 'Available' },
  ] }))
}));

function setup() {
  render(
    <MemoryRouter initialEntries={['/books']}>
      <BooksPage />
    </MemoryRouter>
  );
}

describe('BooksPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    setup();
    // await for one known row to appear
    await screen.findByText('Clean Code');
  });

  it('renders list and search inputs', () => {
    expect(screen.getByRole('heading', { name: /Books/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title or author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by category/i)).toBeInTheDocument();
  });

  it('filters by title text', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Search by title or author/i);
    await user.type(input, 'clean');
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    // Non matching removed
    expect(screen.queryByText('1984')).toBeNull();
  });

  it('filters by author text', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Search by title or author/i);
    await user.clear(input);
    await user.type(input, 'orwell');
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('Animal Farm')).toBeInTheDocument();
    expect(screen.queryByText('Clean Code')).toBeNull();
  });

  it('filters by category select', async () => {
    const user = userEvent.setup();
    const select = screen.getByLabelText(/Filter by category/i);
    await user.selectOptions(select, 'Fiction');
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('Animal Farm')).toBeInTheDocument();
    expect(screen.queryByText('Clean Code')).toBeNull();
  });

  it('combines text and category filters', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Search by title or author/i);
    const select = screen.getByLabelText(/Filter by category/i);
    await user.type(input, 'george');
    await user.selectOptions(select, 'Fiction');
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('Animal Farm')).toBeInTheDocument();
    // Technology books excluded
    expect(screen.queryByText('Clean Code')).toBeNull();
  });

  it('shows no results message when filters exclude all', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Search by title or author/i);
    await user.type(input, 'zzzz');
    expect(screen.getByText(/No matching books/i)).toBeInTheDocument();
  });

  it('reset filters shows all again', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Search by title or author/i);
    const select = screen.getByLabelText(/Filter by category/i);
    await user.type(input, 'clean');
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    await user.clear(input);
    await user.selectOptions(select, ''); // all categories
    // Now one of each category visible
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('1984')).toBeInTheDocument();
  });
});
