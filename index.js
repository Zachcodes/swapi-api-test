require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const sc = require('./starWarsController');

const { SERVER_PORT } = process.env;

const app = express();

app.get('/api/people', sc.getPeople);
app.get('/api/planets', sc.getPlanets);

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}`);
});
