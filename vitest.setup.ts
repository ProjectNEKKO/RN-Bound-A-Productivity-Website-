import '@testing-library/jest-dom';

// Mock the global Audio object
class AudioMock {
    src = '';
    loop = false;
    volume = 1;
    async play() {
        return Promise.resolve();
    }
    pause() { }
    load() { }
}

global.Audio = AudioMock as any;
