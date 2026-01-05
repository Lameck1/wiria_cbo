/**
 * Main Layout Component
 * Provides consistent layout with Header, Footer, and Back to Top button
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTopButton } from '../ui/BackToTopButton';

export interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTopButton />
        </div>
    );
}
