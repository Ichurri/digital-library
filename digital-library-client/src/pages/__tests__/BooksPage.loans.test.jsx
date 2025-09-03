import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BooksPage from '../BooksPage.jsx';

const mockApiGet = vi.fn();
const mockLoan = vi.fn();
const mockReturn = vi.fn();

vi.mock('../../api/client.js', () => ({
  apiGet: (...args) => mockApiGet(...args),
  loanBook: (...args) => mockLoan(...args),
  returnBook: (...args) => mockReturn(...args)
}));

function setup(initialBooks) {
  mockApiGet.mockResolvedValue({ books: initialBooks });
  render(
    <MemoryRouter initialEntries={['/books']}>
      <BooksPage />
    </MemoryRouter>
  );
}

describe('BooksPage loan/return actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders action buttons and disables Loan when already borrowed/lent', async () => {
    setup([
      { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', status: 'available' },
      { id: 2, title: '1984', author: 'George Orwell', category: 'Fiction', status: 'borrowed' },
      { id: 3, title: 'Animal Farm', author: 'George Orwell', category: 'Fiction', status: 'lent' }
    ]);
    await screen.findByText('Clean Code');
    const rows = screen.getAllByRole('row').slice(1); // skip header
    // Row 1 available
    const r1 = rows[0];
    expect(within(r1).getByRole('button', { name: 'Loan' })).toBeEnabled();
    // Row 2 borrowed
    const r2 = rows[1];
    expect(within(r2).getByRole('button', { name: 'Loan' })).toBeDisabled();
    // Row 3 lent alias
    const r3 = rows[2];
    expect(within(r3).getByRole('button', { name: 'Loan' })).toBeDisabled();
  });

  it('loans a book successfully (optimistic)', async () => {
    setup([
      { id: 5, title: 'Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', status: 'available' }
    ]);
    await screen.findByText('Pragmatic Programmer');
    mockLoan.mockResolvedValue({ message: 'Book marked as borrowed' });
    const loanBtn = screen.getByRole('button', { name: 'Loan' });
    const row = loanBtn.closest('tr');
    await userEvent.click(loanBtn);
    // Optimistic change
    expect(within(row).getByText('Borrowed')).toBeInTheDocument();
    expect(mockLoan).toHaveBeenCalledWith(5);
  });

  it('returns a book successfully', async () => {
    setup([
      { id: 6, title: 'Domain-Driven Design', author: 'Eric Evans', category: 'Technology', status: 'borrowed' }
    ]);
    await screen.findByText('Domain-Driven Design');
    mockReturn.mockResolvedValue({ message: 'Book marked as available' });
    const returnBtn = screen.getByRole('button', { name: 'Return' });
    const row = returnBtn.closest('tr');
    await userEvent.click(returnBtn);
    expect(within(row).getByText('Available')).toBeInTheDocument();
    expect(mockReturn).toHaveBeenCalledWith(6);
  });

  it('shows error and reverts when loan fails', async () => {
    setup([
      { id: 7, title: 'Refactoring', author: 'Martin Fowler', category: 'Technology', status: 'available' }
    ]);
    await screen.findByText('Refactoring');
    mockLoan.mockRejectedValue(new Error('Book is already lent'));
    const loanBtn = screen.getByRole('button', { name: 'Loan' });
    const row = loanBtn.closest('tr');
    await userEvent.click(loanBtn);
    // Row should show error text
    expect(await within(row).findByText(/Book is already lent/i)).toBeInTheDocument();
  });
});
