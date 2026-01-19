/**
 * Main Layout Component
 * Provides consistent layout with Header, Footer, and Back to Top button
 */

import type { ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { BackToTopButton } from '../ui/BackToTopButton';

export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
