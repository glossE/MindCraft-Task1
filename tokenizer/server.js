const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'token_demo',
  password: 'root',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Your existing routes...

// Example endpoint for fetching names from PostgreSQL
app.get('/autocomplete', async (req, res) => {
    const { q } = req.query;
  
    try {
      const result = await pool.query('SELECT name FROM names WHERE name ILIKE $1', [`%${q}%`]);
      res.json(result.rows.map(row => row.name));
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Example endpoint for adding a name to PostgreSQL
app.post('/submitData', async (req, res) => {
  const { name, lastName, phoneNumber, address, email } = req.body;
  console.log('Received data:', req.body);

  // Check if the name is not empty
  // if (!name || name.trim() === '') {
  //   return res.status(400).json({ error: 'Name cannot be empty' });
  // }

  try {
    // Check if the name already exists
    const existingName = await pool.query('SELECT * FROM names WHERE name = $1', [name]);

    if (existingName.rows.length === 0) {
      // If the name doesn't exist, insert it into the database along with additional data
      await pool.query('INSERT INTO names (name, last_name, phone_number, address, email) VALUES ($1, $2, $3, $4, $5)',
        [name, lastName, phoneNumber, address, email]);

      res.status(201).json({ success: true });
    } else {
      // If the name already exists, send a response indicating that
      res.status(200).json({ success: false, message: 'Name already exists' });
    }
  } catch (error) {
    console.error('Error adding name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
