const express = require('express');
const router = express.Router();
const bookRouter = require('./books');
const session = require('express-session');


router.use(session({ secret: 'checkpoint', cookie: { maxAge: null } }));

router.get('/numVisits', (req, res, next) => {
  const sess = req.session;
  if (Object.keys(sess).length === 1) sess.number = 0;
  else {
    sess.number++;
  }

  res.send(sess);
});

router.use('/books', bookRouter);

module.exports = router;
