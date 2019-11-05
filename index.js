const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to db!'));

// Middlewar
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(5000, () => console.log('Server Up and running'));