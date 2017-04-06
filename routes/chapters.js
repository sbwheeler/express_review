const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Chapter = require('../models/chapter');

router.param('id', (req, res, next, id) => {
  Chapter.findById(id)
  .then(chapter => {
    if (!chapter) {
      const err = Error('Chapter not found');
      err.status = 404;
      throw err;
    }
    req.chapter = chapter;
    next();
    return null;
  })
  .catch(next);
});

router.get('/:id', (req, res, next) => {
  res.send(req.chapter);
});

router.put('/:id', (req, res, next) => {
  Chapter.update(req.body, {
    where: { id: req.chapter.id },
    returning: true
  })
  .then(result => {
    const updated = result[1][0];
    res.send(updated);
  })
  .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Chapter.destroy({
    where: {
      id: req.chapter.id
    }
  })
  .then(() => {
    res.sendStatus(204);
  })
  .catch(next);
});


module.exports = router;
