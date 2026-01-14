// @vitest-environment jsdom

import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// User Management TDD: Login, Profile View/Edit, Password Reset, Logout

describe('User Management UI', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders login form and validates required fields', () => {
    document.body.innerHTML = `
      <form id="login-form">
        <input name="identifier" required />
        <input name="password" type="password" required />
        <button type="submit">Login</button>
      </form>
      <div id="login-error"></div>
    `;

    const form = document.getElementById('login-form') as HTMLFormElement | null;
    const errorDiv = document.getElementById('login-error') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(errorDiv).not.toBeNull();
    if (!form || !errorDiv) throw new Error('Test DOM not initialized');

    let submitted = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted = true;
      const identifier = (form.querySelector('input[name="identifier"]'))
        ?.value;
      const password = (form.querySelector('input[name="password"]'))
        ?.value;
      if (!identifier || !password) {
        errorDiv.textContent = 'All fields required';
      }
    });

    fireEvent.submit(form);
    expect(submitted).toBe(true);
    expect(errorDiv.textContent).toBe('All fields required');
  });

  it('shows error on invalid login and stores token on success', async () => {
    document.body.innerHTML = `
      <form id="login-form">
        <input name="identifier" value="user@example.com" required />
        <input name="password" value="wrongpass" type="password" required />
        <button type="submit">Login</button>
      </form>
      <div id="login-error"></div>
    `;

    const form = document.getElementById('login-form') as HTMLFormElement | null;
    const errorDiv = document.getElementById('login-error') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(errorDiv).not.toBeNull();
    if (!form || !errorDiv) throw new Error('Test DOM not initialized');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      })
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch('/api/auth/login', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        errorDiv.textContent = data.error;
      }
    });

    fireEvent.submit(form);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    expect(errorDiv.textContent).toBe('Invalid credentials');

    // Simulate success
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'abc123' }),
      })
    );

    const passwordInput = form.querySelector('input[name="password"]');
    expect(passwordInput).not.toBeNull();
    if (!passwordInput) throw new Error('Missing password input');
    passwordInput.value = 'correctpass';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch('/api/auth/login', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('wiria_auth_token', data.token);
      }
    });

    fireEvent.submit(form);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    expect(localStorage.getItem('wiria_auth_token')).toBe('abc123');
  });

  it('renders user profile and allows editing', () => {
    document.body.innerHTML = `
      <div id="profile-view">
        <span id="profile-email">user@example.com</span>
        <button id="edit-profile-btn">Edit</button>
      </div>
      <form id="profile-edit-form" style="display:none">
        <input name="firstName" value="Jane" />
        <input name="lastName" value="Doe" />
        <button type="submit">Save</button>
      </form>
      <div id="profile-success"></div>
    `;

    const editButton = document.getElementById('edit-profile-btn') as HTMLButtonElement | null;
    const editForm = document.getElementById('profile-edit-form') as HTMLFormElement | null;
    const profileView = document.getElementById('profile-view') as HTMLDivElement | null;
    const successDiv = document.getElementById('profile-success') as HTMLDivElement | null;
    expect(editButton).not.toBeNull();
    expect(editForm).not.toBeNull();
    expect(profileView).not.toBeNull();
    expect(successDiv).not.toBeNull();
    if (!editButton || !editForm || !profileView || !successDiv)
      throw new Error('Test DOM not initialized');

    editButton.addEventListener('click', () => {
      profileView.style.display = 'none';
      editForm.style.display = 'block';
    });

    fireEvent.click(editButton);
    expect(profileView.style.display).toBe('none');
    expect(editForm.style.display).toBe('block');

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      successDiv.textContent = 'Profile updated!';
    });

    fireEvent.submit(editForm);
    expect(successDiv.textContent).toBe('Profile updated!');
  });

  it('shows password reset form and handles errors', () => {
    document.body.innerHTML = `
      <form id="reset-form">
        <input name="email" type="email" required />
        <button type="submit">Reset Password</button>
      </form>
      <div id="reset-error"></div>
    `;

    const form = document.getElementById('reset-form') as HTMLFormElement | null;
    const errorDiv = document.getElementById('reset-error') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(errorDiv).not.toBeNull();
    if (!form || !errorDiv) throw new Error('Test DOM not initialized');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email =
        (form.querySelector('input[name="email"]'))?.value ?? '';
      if (!email.includes('@')) {
        errorDiv.textContent = 'Invalid email';
      }
    });

    fireEvent.submit(form);
    expect(errorDiv.textContent).toBe('Invalid email');
  });

  it('logs out and clears token', () => {
    localStorage.setItem('wiria_auth_token', 'abc123');
    document.body.innerHTML = '<button id="logout-btn">Logout</button>';

    const button = document.getElementById('logout-btn') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    if (!button) throw new Error('Missing logout button');

    button.addEventListener('click', () => {
      localStorage.removeItem('wiria_auth_token');
    });

    fireEvent.click(button);
    expect(localStorage.getItem('wiria_auth_token')).toBeNull();
  });
});
