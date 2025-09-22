const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Simple hardcoded credentials (later use JWT/DB)
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

app.use(cors());
app.use(bodyParser.json());

const ANNOUNCEMENT_FILE = path.join(__dirname, 'announcement.json');

// Admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Update announcement (protected)
app.post('/admin/announcement', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  fs.writeFile(ANNOUNCEMENT_FILE, JSON.stringify({ text }), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving announcement" });
    }
    res.json({ message: "Announcement updated successfully", text });
    console.log("Updated announcement:", text);
  });
});

// Get announcement (public endpoint for frontend)
app.get('/announcement', (req, res) => {
  fs.readFile(ANNOUNCEMENT_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.json({ text: "" }); // default empty
    }
    console.log("Fetched announcement:", JSON.parse(data));
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Admin backend running on http://localhost:${PORT}`);
});
