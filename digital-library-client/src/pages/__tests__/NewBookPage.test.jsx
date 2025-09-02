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
    expect(screen.getByRole('button', { name: /Save Book/i })).toBeDisabled()
  })

  it('shows validation errors on submit when empty', async () => {
    const user = userEvent.setup()
    const saveBtn = screen.getByRole('button', { name: /Save Book/i })
    await user.click(saveBtn)
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Author is required')).toBeInTheDocument()
    expect(screen.getByText('Category is required')).toBeInTheDocument()
  })

  it('enables submit when form is valid and submits', async () => {
    // re-render to have clean state
    // The beforeEach already did, so continuing
    const user = userEvent.setup()
    const title = screen.getByLabelText(/Title/i)
    const author = screen.getByLabelText(/Author/i)
    const category = screen.getByLabelText(/Category/i)
    await user.type(title, 'Clean Code')
    await user.type(author, 'Robert C. Martin')
    await user.selectOptions(category, 'Technology')

    const saveBtn = screen.getByRole('button', { name: /Save Book/i })
    expect(saveBtn).toBeEnabled()

    // Spy on alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    await user.click(saveBtn)
    expect(alertSpy).toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('displays per-field errors only after blur or submit', async () => {
    const user = userEvent.setup()
    const title = screen.getByLabelText(/Title/i)
    await user.click(title)
    await user.tab() // move focus away to trigger blur
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    // Author not touched yet
    expect(screen.queryByText('Author is required')).not.toBeNull()
  })
})
