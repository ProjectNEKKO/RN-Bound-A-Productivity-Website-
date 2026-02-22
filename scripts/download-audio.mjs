import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory exists
const targetDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const tracks = [
    {
        name: 'rain.ogg',
        url: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
    },
    {
        name: 'cafe.ogg',
        url: 'https://actions.google.com/sounds/v1/crowds/cafe_restaurant.ogg',
    },
    {
        name: 'nature.ogg',
        url: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg',
    },
];

console.log('Downloading audio files...');

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https
            .get(url, { headers: { 'User-Agent': 'FocusHub/1.0' } }, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                }
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                    return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            })
            .on('error', (err) => {
                fs.unlink(dest, () => { });
                reject(err);
            });
    });
};

async function downloadAll() {
    for (const track of tracks) {
        const dest = path.join(targetDir, track.name);
        try {
            if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
                console.log(`Skipping ${track.name}, already exists.`);
                continue;
            }
            console.log(`Downloading ${track.name} from ${track.url}`);
            await downloadFile(track.url, dest);
            console.log(`Successfully downloaded ${track.name}`);
        } catch (err) {
            console.error(`Error downloading ${track.name}:`, err.message);
        }
    }
}

downloadAll().then(() => {
    console.log('Finished downloading audio files.');
});
