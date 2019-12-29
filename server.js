const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const helmet = require('helmet')
const path = require('path');
const connect = require('./db');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const { recommendInitialCity, recommendCity, listCities, postSurvey, recommendCityWithCritiques, recommendInitialCityWithCritiques  } = require('./recommender/controller');

const app = express();
const port = process.env.PORT || 5000;
connect()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet())
app.use(helmet())
app.use(session({
  genid: function(req) {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: '8M0V5URRkT',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get('/api/initial-recommendation', recommendInitialCity);
app.get('/api/recommendation', recommendCity);
app.get('/api/cities', listCities);
app.post('/api/survey', postSurvey);
app.get('/api/recommendations-with-critiques', recommendCityWithCritiques);
app.get('/api/initial-recommendations-with-critiques', recommendInitialCityWithCritiques);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server started on port: ${port}`));