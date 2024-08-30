const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to JSON file
const filePath = path.join(__dirname, 'data.json');

// Read users from JSON file
function readUsers(callback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If file does not exist, return an empty array
                return callback([]);
            } else {
                throw err;
            }
        }
        callback(JSON.parse(data));
    });
}

// Write users to JSON file
function writeUsers(users, callback) {
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
        if (err) throw err;
        callback();
    });
}

// Serve static files (like HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle user registration
app.post('/register', (req, res) => {
    const { name, username, password } = req.body;

    readUsers((users) => {
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        users.push({ name, username, password });
        writeUsers(users, () => {
            res.send('Success');
        });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
