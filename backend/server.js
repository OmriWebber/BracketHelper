const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/save-drivers', (req, res) => {
  const { drivers, filename } = req.body;
  fs.writeFile(`${filename}.json`, JSON.stringify(drivers), (err) => {
    if (err) {
      res.status(500).send('Failed to save drivers');
    } else {
      res.send('Drivers saved successfully');
    }
  });
});

app.get('/list-files', (req, res) => {
  fs.readdir('.', (err, files) => {
    if (err) {
      res.status(500).send('Failed to list files');
    } else {
      const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'package.json' && file !== 'package-lock.json');
      res.json(jsonFiles);
    }
  });
});

app.get('/load-drivers/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`${filename}.json`, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Failed to load drivers');
    } else {
      try {
        const drivers = data ? JSON.parse(data) : [];
        res.json(drivers);
      } catch (parseError) {
        res.status(500).send('Failed to parse drivers');
      }
    }
  });
});

app.post('/create-file', (req, res) => {
  const { filename } = req.body;
  fs.writeFile(`${filename}.json`, '[]', (err) => {
    if (err) {
      res.status(500).send('Failed to create file');
    } else {
      res.send('File created successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

