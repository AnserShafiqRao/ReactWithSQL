const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Middleware
app.use(cors());
app.use(express.json());  // Corrected the usage of express.json
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'forreactproject',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// POST route for form submission
app.post('/post', (req, res) => {
  const clientName = req.body.clientName;
  const description = req.body.description;

  const sql = 'INSERT INTO MyTable (name, description) VALUES (?, ?)';
  
  db.query(sql, [clientName, description], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Database error');
    }
    console.log('New Data inserted:', result);
    res.status(200).json({ message: 'Submission Successful' });
  });
});

// GET route to retrieve data
app.get('/get-data', (req, res) => {
  const getData = 'SELECT * FROM MyTable ORDER BY name';
  
  db.query(getData, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Unable to read from DB');
    }
    res.status(200).json(result);  // Sending data as JSON
  });
});

app.get('/get-data/:name', (req, res) => {
    const name = req.params.name;  // Use req.params to get the URL parameter
    
    const getData = 'SELECT * FROM MyTable WHERE name = ?';  // Corrected SQL syntax
    
    db.query(getData, [name], (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Unable to read from DB');
      }
      res.status(200).json(result);  // Sending data as JSON
    });
  });


  app.delete('/delete-post', (req, res) => {
    const { name, description } = req.query;  // Extract from query parameters
  
    const sql = 'DELETE FROM MyTable WHERE name = ? AND description = ?';
    
    db.query(sql, [name, description], (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        return res.status(500).send('Unable to delete from DB');
      }
      else{
        console.log('Deleted Something')
        res.status(200).json({ message: 'Deleted successfully' });
      }

    });
  });
  
  // });
// Start the server
app.listen(4000, () => {
  console.log('Backend running on port 4000');
});
