const express = require('express');
const db = require('../Database');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with timestamp + original extension
    },
});
const upload = multer({ storage });

router.post('/newuser', upload.single('ProfilePic'), (req, res) => {
    const {
        FullName, UserName, Password, Email, ContactNumber,
        DateOfBirth, CreationDate, CreationTime, Location
    } = req.body;

    const profilePicPath = req.file ? `uploads/${req.file.filename}` : null; // Path to the saved image
    
    // Check if the username already exists
    const checkUsername = 'SELECT * FROM usersdata WHERE UserName = ?';
    db.query(checkUsername, [UserName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            // If username exists, return an error
            return res.status(400).json({ message: 'Username already exists' });
        } else {
            // Proceed with user creation
            const userEntry = 'INSERT INTO usersdata (FullName, UserName, Password, Email, ContactNumber, DateOfBirth, Location, CreationDate, CreationTime, ProfilePic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(userEntry, [FullName, UserName, Password, Email, ContactNumber, DateOfBirth, Location, CreationDate, CreationTime, profilePicPath], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }
                res.status(200).send('User successfully added');
            });
        }
    });
});

module.exports = router;
