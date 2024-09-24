const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./Database');
const multer = require('multer');
const path = require('path');

const CreateUser= require('./Routes/UserCreation');
const FetchUser = require('./Routes/FetchUserData');




// Middleware
app.use(cors());
app.use(express.json());  // Corrected the usage of express.json
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Save files with timestamp + original extension
  },
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const { UserName } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    const setImage = `INSERT INTO userimages(UserName, FilePath) VALUES (?, ?)`;
    db.query(setImage, [UserName, imagePath], (err, result) => {
      if (err) {
        console.log('File not getting saved', err);
        return res.status(500).send('File Uploading not getting done');
      }
      res.status(200).json(result);
      console
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading image', error: err });
  }
});
app.get('/get-images/:UserName', (req,res)=>{
  const UserName = req.params.UserName;
  const fetchImages = `SELECT * FROM userimages WHERE UserName = ?`;

  db.query(fetchImages, [UserName],(err, result) =>{
    if(err){
      return res.status(500).send('No Image Found')
    }
    res.status(200).json(result);
  })

})



app.post('/newuser',CreateUser);
app.get('/fetchuser/:UserName', FetchUser);



  
  // });
// Start the server
app.listen(4000, () => {
  console.log('Backend running on port 4000');
});
