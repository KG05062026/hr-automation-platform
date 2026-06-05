const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── TEST ROUTE ──────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ HR Automation API is running!' });
});

// ── CREATE A JOB ────────────────────────────────────
app.post('/jobs', async (req, res) => {
  try {
    const { title, department, location } = req.body;
    const result = await pool.query(
      `INSERT INTO job_requisitions (title, department, location)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, department, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ALL JOBS ─────────────────────────────────────
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_requisitions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ONE JOB ──────────────────────────────────────
app.get('/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_requisitions WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START SERVER ─────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});