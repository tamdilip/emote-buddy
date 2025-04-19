// generateVideoList.js
const fs = require('fs');
const path = require('path');

// Define the folder containing the videos
const videosFolder = path.join(__dirname, 'assets', 'videos');

// Common video file extensions
const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];

// Function to scan the folder and generate the videoFiles list
function generateVideoFilesList() {
    try {
        // Read the contents of the videos folder
        const files = fs.readdirSync(videosFolder);

        // Filter for video files
        const videoFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return videoExtensions.includes(ext);
        });

        // Format the list as a JavaScript array
        const videoFilesArray = videoFiles.map(file => `assets/videos/${file}`);

        // Output the formatted array
        console.log('Copy the following into your videoFiles array:\n');
        console.log('const videoFiles = [');
        videoFilesArray.forEach((file, index) => {
            console.log(`    '${file}'${index < videoFilesArray.length - 1 ? ',' : ''}`);
        });
        console.log('];');

        if (videoFiles.length === 0) {
            console.warn('No video files found in the assets/videos folder.');
        } else {
            console.log(`\nFound ${videoFiles.length} video files.`);
        }
    } catch (error) {
        console.error('Error reading the videos folder:', error.message);
    }
}

// Run the function
generateVideoFilesList();