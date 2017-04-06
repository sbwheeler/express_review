const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Chapter = require('../models/chapter');
const chapterRouter = require('./chapters')

router.param('id', (req, res, next, id) => {
  Book.findById(id)
  .then(book => {
    if (!book) {
      const err = new Error('Book not found');
      err.status = 404;
      throw err;
    }
    req.book = book;
    next();
    return null;
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    Book.find(req.query)
    .then(foundBook => {
      res.send([foundBook])
    })

  } else {
    Book.findAll()
      .then(allBooks => {
        res.json(allBooks);
      })
      .catch(next);

  }
});

router.post('/', (req, res, next) => {
  Book.create(req.body)
    .then(createdBook => {
      res.status(201).send(createdBook);
    })
    .catch(next);
});


router.get('/:id', (req, res, next) => {
  res.send(req.book);
});

router.put('/:id', (req, res, next) => {
  Book.update(req.body, {
    where: {id: req.book.id},
    returning: true
  })
  .then(book => {
    const updated = book[1][0];
    res.send(updated);
  })
  .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Book.destroy({
    where: {
      id: req.book.id
    }
  })
  .then(() => {
    res.sendStatus(204);
  })
  .catch(next);
});

router.get('/:id/chapters', (req, res, next) => {
  Book.findAll({
    where: {
      id: req.book.id
    },
    include: [Chapter]
  })
  .then(results => {
    res.send(results);
  })
  .catch(next);
});

router.post('/:id/chapters', (req, res, next) => {
  Chapter.create(req.body)
  .then(createdChapter => {
    return createdChapter.setBook(req.book)
    .then(chapter => {
      res.status(201).send(createdChapter);
    });
  })
  .catch(next);
});

//make a subrouter here, then do a router.params in that
router.use('/:id/chapters/', chapterRouter);

module.exports = router;
