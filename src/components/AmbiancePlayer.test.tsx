import { render, screen, fireEvent } from '@testing-library/react';
import { AmbiancePlayer } from './AmbiancePlayer';
import { beforeEach, describe, it, expect } from 'vitest';

describe('AmbiancePlayer (MusicView)', () => {
    beforeEach(() => {
        // Clear mocks
    });

    it('renders the music player correctly', () => {
        render(<AmbiancePlayer />);

        // Check hero track name (appears in hero + player bar)
        expect(screen.getAllByText('Midnight Coffee').length).toBeGreaterThanOrEqual(1);

        // Check section headings
        expect(screen.getByText('Curated Playlists')).toBeInTheDocument();

        // Check buttons
        expect(screen.getByLabelText('Previous Ambiance')).toBeInTheDocument();
        expect(screen.getAllByLabelText('Play').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByLabelText('Next Ambiance')).toBeInTheDocument();
    });

    it('toggles play/pause state', async () => {
        render(<AmbiancePlayer />);

        // Find the bottom player bar play button
        const playButtons = screen.getAllByLabelText('Play');
        const bottomBarPlay = playButtons[playButtons.length - 1];
        expect(bottomBarPlay).toBeInTheDocument();

        // Click play
        fireEvent.click(bottomBarPlay);

        // Check if it turned into pause button
        const pauseButtons = await screen.findAllByLabelText('Pause');
        expect(pauseButtons.length).toBeGreaterThanOrEqual(1);

        // Click pause
        fireEvent.click(pauseButtons[pauseButtons.length - 1]);
    });

    it('switches tracks when clicked', () => {
        render(<AmbiancePlayer />);

        const nextButton = screen.getByLabelText('Next Ambiance');

        fireEvent.click(nextButton);

        // Verify the hero and player bar both show the next track (Rainy Day)
        // "Rainy Day" will appear in hero, player bar, and playlist card
        const allRainyDay = screen.getAllByText('Rainy Day');
        expect(allRainyDay.length).toBeGreaterThanOrEqual(2);
    });
});
