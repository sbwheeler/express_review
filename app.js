const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');


module.exports = app;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/files', express.static(path.join(__dirname, 'public/static')));


app.use('/api', apiRouter);

app.get('*', (req, res, next) => {
  if (req.originalUrl === '/forbidden') {
    const err = Error('Forbidden.');
    err.status = 403;
    next(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Error');
});

