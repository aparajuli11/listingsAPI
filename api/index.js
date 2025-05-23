require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ListingsDB = require('../modules/listingsDB.js');

// Initialize DB connection once
const db = new ListingsDB();
db.initialize(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB init failed', err));

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API is up and running!' });
});

// GET: retrieve listings with optional pagination and name filter
app.get('/api/listings', (req, res) => {
  const { page = 1, perPage = 10, name } = req.query;
  db.getAllListings(parseInt(page, 10), parseInt(perPage, 10), name)
    .then(listings => res.json(listings))
    .catch(err => res.status(500).json({ error: err.message }));
});

// GET: retrieve a single listing by ID
app.get('/api/listings/:id', (req, res) => {
  db.getListingById(req.params.id)
    .then(listing => {
      if (listing) {
        res.json(listing);
      } else {
        res.status(404).json({ message: 'Listing not found' });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// POST: create a new listing
app.post('/api/listings', (req, res) => {
  db.addNewListing(req.body)
    .then(newId => res.status(201).json({ id: newId }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// PUT: update an existing listing
app.put('/api/listings/:id', (req, res) => {
  db.updateListingById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ error: err.message }));
});

// DELETE: remove a listing
app.delete('/api/listings/:id', (req, res) => {
  db.deleteListingById(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ error: err.message }));
});

// Export the Express app as a Vercel Serverless Function
module.exports = app;
