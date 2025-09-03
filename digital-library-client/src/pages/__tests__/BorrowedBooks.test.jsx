import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BorrowedBooks from '../BorrowedBooks.jsx';

// Mock API client
const mockApiGet = vi.fn();
const mockGetBooksByStatus = vi.fn();

vi.mock('../../api/client', () => ({
  apiGet: (...args) => mockApiGet(...args),
  getBooksByStatus: (...args) => mockGetBooksByStatus(...args),
}));

describe('BorrowedBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders borrowed books with category', async () => {
    mockApiGet.mockResolvedValueOnce({
      categories: [
        { id: 1, name: 'Science' },
        { id: 2, name: 'History' },
      ],
    });
    mockGetBooksByStatus.mockResolvedValueOnce({
      books: [
        { id: 101, title: 'Physics 101', author: 'Einstein', category_id: 1, status: 'borrowed' },
        { id: 102, title: 'World War II', author: 'Churchill', category_id: 2, status: 'borrowed' },
      ],
    });

    render(<BorrowedBooks />);
    expect(screen.getByText(/Loading borrowed books/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Physics 101')).toBeInTheDocument();
      expect(screen.getByText('Einstein')).toBeInTheDocument();
      expect(screen.getByText('Science')).toBeInTheDocument();
      expect(screen.getByText('World War II')).toBeInTheDocument();
      expect(screen.getByText('Churchill')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getAllByText('Borrowed').length).toBe(2);
    });
  });

  it('shows empty state when no borrowed books', async () => {
    mockApiGet.mockResolvedValueOnce({ categories: [] });
    mockGetBooksByStatus.mockResolvedValueOnce({ books: [] });

    render(<BorrowedBooks />);
    await waitFor(() => {
      expect(screen.getByText(/No borrowed books found/i)).toBeInTheDocument();
    });
  });
});