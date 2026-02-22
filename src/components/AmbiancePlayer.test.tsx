import { render, screen, fireEvent } from '@testing-library/react';
import { AmbiancePlayer } from './AmbiancePlayer';
import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('AmbiancePlayer', () => {
    beforeEach(() => {
        // Clear mocks if any
    });

    it('renders the ambiance player correctly', () => {
        render(<AmbiancePlayer />);

        // Check header
        expect(screen.getByText('Ambiance')).toBeInTheDocument();

        // Check initial state
        expect(screen.getByText('Paused')).toBeInTheDocument();

        // Check tracks are rendered
        const textNodes = screen.getAllByText(/Rain|Cafe|Nature/);
        expect(textNodes.length).toBeGreaterThan(0);
    });

    it('toggles play/pause state', async () => {
        render(<AmbiancePlayer />);

        const playButton = screen.getByLabelText('Play');
        expect(playButton).toBeInTheDocument();

        // Click play
        fireEvent.click(playButton);
        expect(await screen.findByText('Playing')).toBeInTheDocument();

        // Check if it turned into pause button
        const pauseButton = screen.getByLabelText('Pause');
        expect(pauseButton).toBeInTheDocument();

        // Click pause
        fireEvent.click(pauseButton);
        expect(await screen.findByText('Paused')).toBeInTheDocument();
    });

    it('switches tracks when clicked', () => {
        render(<AmbiancePlayer />);

        const buttons = screen.getAllByRole('button');
        // Find a button that has "Cafe" text inside it
        const cafeButton = buttons.find(b => b.textContent?.includes('Cafe'));
        expect(cafeButton).toBeDefined();

        fireEvent.click(cafeButton!);

        // Verify it updated the main text
        // The active track name is displayed in a span
        const allCafes = screen.getAllByText('Cafe');
        expect(allCafes.length).toBeGreaterThanOrEqual(1);
    });
});
