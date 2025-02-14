const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch songs from a specific folder
app.get('/songs/:folder', (req, res) => {
    const folder = req.params.folder;
    const folderPath = path.join(__dirname, 'public', 'songs', folder);

    // Read the directory and send the list of MP3 files
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan songs directory');
        }
        const songs = files.filter(file => file.endsWith('.mp3'));
        res.json(songs);
    });
});


// Endpoint to list album folders
app.get('/albums', (req, res) => {
    const songsPath = path.join(__dirname, 'public', 'songs');

    // Read the "songs" directory
    fs.readdir(songsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan albums directory' });
        }

        // Filter out only directories
        const folders = files.filter(file => {
            const filePath = path.join(songsPath, file);
            return fs.statSync(filePath).isDirectory();
        });

        // Send the list of folders as a JSON response
        res.json(folders);
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});