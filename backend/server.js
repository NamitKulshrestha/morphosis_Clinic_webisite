const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to handle appointment form
app.post('/book-appointment', async (req, res) => {
  const { name, email, contact, gender, message, fromDate, toDate } = req.body;

  // Basic input validation
  if (!name || !email || !contact || !gender || !fromDate || !toDate) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Setup transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: `"Website Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: 'New Appointment Booking',
    html: `
      <h3>New Appointment Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p><strong>Preferred Date Range:</strong> ${fromDate} to ${toDate}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Appointment request sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send appointment request.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
