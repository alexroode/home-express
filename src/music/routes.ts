import * as promiseRouter from 'express-promise-router';
import * as moment from 'moment';
import * as MusicService from './musicService';
import { Router } from 'express';
let Music = MusicService.default;

let router = promiseRouter();

var formatYear = function (dateString) {
  var date = moment(dateString, "YYYY/MM/DD");
  if (!date) {
    return '';
  }
  return date.format('YYYY');
}

var formatDate = function (dateString) {
  var date = moment(dateString, "YYYY/MM/DD");
  if (!date) {
    return '';
  }
  return date.format('MMMM D, YYYY');
}

router.get("/", function (req, res, next) {
  return Music.getAll().then(function(music) {
    res.render('music/index', { title: 'Music', categories: music.categories});
  });
});

router.get('/:categoryId', function(req, res, next) {
  return Music.findCategory(req.params.categoryId)
    .then (function(category) {
      req.category = category
    }).then(function() {
      return Music.getInCategory(req.params.categoryId)
        .then(function(pieces) {
          res.render('music/category', { 
            title: req.category.name, 
            category: req.category, 
            pieces: pieces, 
            formatYear: formatYear 
          });
        });
    });
});

router.get('/:categoryId/:pieceId', function(req, res, next) {
  return Music.findPiece(req.params.pieceId, req.params.categoryId)
    .then(function(piece) {
      res.render('music/piece', { 
        title: piece.title, 
        piece: piece,
        formatYear: formatYear,
        formatDate: formatDate
      });
    });
});

export const MusicRoutes: Router = router;