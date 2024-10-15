import {Application} from "express";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ts-crud-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

function bookRoutes() {

}

// Routes
app.use('/api', bookRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the TypeScript CRUD API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
