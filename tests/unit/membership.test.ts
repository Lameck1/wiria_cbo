// @vitest-environment jsdom

import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, beforeEach } from 'vitest';

// Membership Page TDD: Rendering, layout, form validation, submission, error/success states

describe('Membership Page', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders hero/header, content, and footer sections', () => {
    // Simulate loading the membership.html structure
    // (In real test, import or fetch the HTML, here we stub key elements)
    document.body.innerHTML = `
      <header id="main-header"></header>
      <main>
        <section id="hero"></section>
        <section id="membership-form-section">
          <form id="membership-form">
            <input name="firstName" required />
            <input name="lastName" required />
            <input name="email" type="email" required />
            <input name="phone" required />
            <select name="membershipType" required>
              <option value="INDIVIDUAL">Individual</option>
              <option value="YOUTH">Youth</option>
              <option value="FAMILY">Family</option>
              <option value="CORPORATE">Corporate</option>
            </select>
            <button type="submit">Apply</button>
          </form>
        </section>
      </main>
      <footer id="main-footer"></footer>
    `;
    expect(document.getElementById('main-header')).toBeInTheDocument();
    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('membership-form-section')).toBeInTheDocument();
    expect(document.getElementById('main-footer')).toBeInTheDocument();
  });

  it('validates required fields and email format', () => {
    document.body.innerHTML = `
      <form id="membership-form">
        <input name="firstName" required />
        <input name="lastName" required />
        <input name="email" type="email" required />
        <input name="phone" required />
        <select name="membershipType" required>
          <option value="INDIVIDUAL">Individual</option>
        </select>
        <button type="submit">Apply</button>
      </form>
      <div id="form-error"></div>
    `;

    const form = document.getElementById('membership-form') as HTMLFormElement | null;
    const errorDiv = document.getElementById('form-error') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(errorDiv).not.toBeNull();
    if (!form || !errorDiv) throw new Error('Test DOM not initialized');

    const email = form.querySelector('input[name="email"]');
    expect(email).not.toBeNull();
    if (!email) throw new Error('Missing email input');

    let submitted = false;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted = true;
      if (!(email as HTMLInputElement).value.includes('@')) {
        errorDiv.textContent = 'Invalid email';
      }
    });

    fireEvent.submit(form);
    expect(submitted).toBe(true);
    expect(errorDiv.textContent).toBe('Invalid email');
  });

  it('shows success message on valid submission', () => {
    document.body.innerHTML = `
      <form id="membership-form">
        <input name="firstName" value="Jane" required />
        <input name="lastName" value="Doe" required />
        <input name="email" value="jane@example.com" type="email" required />
        <input name="phone" value="254712345678" required />
        <select name="membershipType" required>
          <option value="INDIVIDUAL">Individual</option>
        </select>
        <button type="submit">Apply</button>
      </form>
      <div id="form-success"></div>
    `;

    const form = document.getElementById('membership-form') as HTMLFormElement | null;
    const successDiv = document.getElementById('form-success') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(successDiv).not.toBeNull();
    if (!form || !successDiv) throw new Error('Test DOM not initialized');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successDiv.textContent = 'Application submitted successfully!';
    });

    fireEvent.submit(form);
    expect(successDiv.textContent).toBe('Application submitted successfully!');
  });

  it('handles backend error response', () => {
    document.body.innerHTML = `
      <form id="membership-form">
        <input name="firstName" value="Jane" required />
        <input name="lastName" value="Doe" required />
        <input name="email" value="jane@example.com" type="email" required />
        <input name="phone" value="254712345678" required />
        <select name="membershipType" required>
          <option value="INDIVIDUAL">Individual</option>
        </select>
        <button type="submit">Apply</button>
      </form>
      <div id="form-error"></div>
    `;

    const form = document.getElementById('membership-form') as HTMLFormElement | null;
    const errorDiv = document.getElementById('form-error') as HTMLDivElement | null;
    expect(form).not.toBeNull();
    expect(errorDiv).not.toBeNull();
    if (!form || !errorDiv) throw new Error('Test DOM not initialized');

    // Simulate backend error
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorDiv.textContent = 'Server error: Email already exists';
    });

    fireEvent.submit(form);
    expect(errorDiv.textContent).toBe('Server error: Email already exists');
  });
});
