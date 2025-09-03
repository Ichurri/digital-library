import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import NewBookPage from '../NewBookPage.jsx'

function setup() {
  render(
    <MemoryRouter initialEntries={['/books/new']}>
      <NewBookPage />
    </MemoryRouter>
  )
}

describe('NewBookPage', () => {
  beforeEach(() => {
    setup()
  })

  it('renders form fields', () => {
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Book/i })).toBeEnabled()
  })

  it('shows validation errors on submit when empty', async () => {
    const user = userEvent.setup()
    const saveBtn = screen.getByRole('button', { name: /Save Book/i })
    await user.click(saveBtn)
  expect(await screen.findByText('Title is required')).toBeInTheDocument()
  expect(screen.getByText('Author is required')).toBeInTheDocument()
  expect(screen.getByText('Category is required')).toBeInTheDocument()
  })

  it('submits when form is valid', async () => {
    const user = userEvent.setup()
    const title = screen.getByLabelText(/Title/i)
    const author = screen.getByLabelText(/Author/i)
    const category = screen.getByLabelText(/Category/i)
    await user.type(title, 'Clean Code')
    await user.type(author, 'Robert C. Martin')
    await user.selectOptions(category, 'Technology')
    const saveBtn = screen.getByRole('button', { name: /Save Book/i })
    expect(saveBtn).toBeEnabled()
    // Mock fetch for POST
    const originalFetch = global.fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Book registered.' }) }))
    await user.click(saveBtn)
    expect(await screen.findByText(/Book registered\./i)).toBeInTheDocument()
    global.fetch = originalFetch
  })

  it('displays field-specific error after blur without showing others', async () => {
    const user = userEvent.setup()
    const title = screen.getByLabelText(/Title/i)
    await user.click(title)
    await user.tab() // blur
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    // Other errors should not appear before submit or blur
    expect(screen.queryByText('Author is required')).toBeNull()
    expect(screen.queryByText('Category is required')).toBeNull()
  })
})
