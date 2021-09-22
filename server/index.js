var environment = process.env;
if (environment.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sanitizeHtml = require('sanitize-html');
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer');
const async = require('async');
const upload = multer({ dest: 'tmp/' });

const app = express({ strict: false });

const User = require('./models/User');
const Article = require('./models/Article');
const Party = require('./models/Party');
const Comment = require('./models/Comment');

// middleware
app.use(
  session({
    secret: environment.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser(environment.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongo db
mongoose.connect(
  'mongodb://localhost:27017/sermo',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Mongoose is connected');
  }
);

// routes
// authenticate
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.send({ success: false, msg: 'Could not log in', user: null });
    }
    if (!user) {
      return res.send({ success: false, msg: 'Could not log in', user: null });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.send({ success: false, msg: 'Could not log in', user: null });
      }
      return res.send({ success: true, msg: 'Successfully logged in', user: req.user });
    });
  })(req, res, next);
});
// logout
app.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.send({ success: true });
  });
});
// check authentication
app.post('/checkLogged', function (req, res) {
  res.send({ user: req.user });
});
// register
app.post('/register', function (req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, function (err) {
    if (err) {
      res.send({ success: false, msg: 'Something went wrong' });
      return next(err);
    }
    res.send({ success: true, msg: 'Successfully registrated' });
  });
});

//get search results
app.get('/search/', async (req, res) => {
  const searchRegExp = new RegExp(req.query.s, 'i');
  let queries = [];
  let docs = [];

  let filterArticle = { $or: [{ title: searchRegExp }, { content: searchRegExp }] };
  queries.push(function (cb) {
    Article.find(filterArticle)
      .populate('user', ['username', 'defaultImg'])
      .sort({ timestamp: -1 })
      .limit(20)
      .exec(function (err, result) {
        if (err) return;
        cb(null, (docs[0] = result));
      });
  });

  let filterComment = {
    content: searchRegExp,
  };

  queries.push(function (cb) {
    Comment.find(filterComment)
      .sort({ timestamp: -1 })
      .populate('user', ['username', 'defaultImg'])
      .exec(function (err, result) {
        if (err) return;
        cb(null, (docs[2] = result));
      });
  });

  let filterUser = { $or: [{ username: searchRegExp }, { firstName: searchRegExp }, { lastName: searchRegExp }] };

  queries.push(function (cb) {
    User.find(filterUser)
      .sort({ timestamp: -1 })
      .exec(function (err, result) {
        if (err) return;
        cb(null, (docs[3] = result));
      });
  });

  async.parallel(queries, function (err, docs) {
    // if any query fails
    if (err) {
      throw err;
    }

    res.send({ success: true, error: null, articles: docs[0], comments: docs[1], users: docs[2], msg: 'Successfull search' });
  });
});

// post politician
// app.post('/politician/', isLoggedIn, upload.single('img'), async (req, res) => {
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const bio = req.body.bio;
//   const role = req.body.role;
//   const party = req.body.party;
//   const active = req.body.active;
//   const politician = new Politician({ firstName: firstName, lastName: lastName, role: role, bio: bio, defaultImg: req.file.filename + '.jpg', party: party, active: active, user: req.user });

//   try {
//     await politician.save();
//     console.log('saved new politician');
//     let oldDir = 'tmp/' + req.file.filename;
//     let newDir = '../client/public/uploads/politicians/' + politician._id + '/';
//     if (!fs.existsSync(newDir)) {
//       fs.mkdirSync(newDir);
//     }
//     fs.rename(oldDir, newDir + req.file.filename + '.jpg', function (err) {
//       if (err) throw err;
//       console.log('successfully renamed');
//     });
//     res.send({ success: true, error: null, politician: politician, msg: 'Saved new politician' });
//   } catch (err) {
//     console.log(err);
//     res.send({ success: false, error: err, politician: null, msg: 'Failed to add politician' });
//   }
// });
//get comments
app.get('/comments/', async (req, res) => {
  console.log('filter for comments:');
  console.log(req.query);
  let filter = {};
  if (req.query.user) filter.user = req.query.user;
  if (req.query.article) filter.article = req.query.article;

  Comment.find(filter)
    .populate('user', ['username', 'defaultImg'])
    .sort({ timestamp: -1 })
    .limit(20)
    .exec(function (err, result) {
      if (err) res.send(err);
      res.send(result);
    });
});
// post comment
app.post('/comment/', isLoggedIn, async (req, res) => {
  const content = req.body.content;
  const article = req.body.article;
  const comment = new Comment({ content: content, article: article, user: req.user });

  try {
    await comment.save();
    console.log('saved new comment');

    // try to like
    try {
      Article.updateOne(
        { _id: article },
        {
          $inc: { commentCount: 1 },
        },
        function (err, result) {
          if (err) console.log(err);
          console.log('Increased CommentCount!');
        }
      );
    } catch (err) {
      console.log('Failed increase commentCount');
    }

    res.send({ success: true, error: null, comment: comment, msg: 'Saved new comment' });
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err, comment: null, msg: 'Failed to add comment' });
  }
});
//get articles
app.get('/articles/', async (req, res) => {
  console.log(req.query);
  let filter = {};
  if (req.query.user) filter.user = req.query.user;

  Article.find(filter)
    .populate('user', ['username', 'defaultImg'])
    .sort({ timestamp: -1 })
    .limit(20)
    .exec(function (err, result) {
      if (err) res.send(err);
      resultJson = JSON.parse(JSON.stringify(result));
      resultJson = resultJson.map(function (article) {
        article.likedByUser = false;
        if (req.user) {
          article.likedByUser = article.likes.includes(String(req.user._id));
        }
        return article;
      });
      res.json(resultJson);
    });
});
//get articles
app.get('/articles/top/', async (req, res) => {
  let filter = {};
  if (req.query.user) filter.user = req.query.user;
  Article.find(filter)
    .populate('user', ['username', 'defaultImg'])
    .sort({ timestamp: -1 })
    .limit(5)
    .exec(function (err, result) {
      if (err) res.send(err);
      res.send(result);
    });
});
//get article
app.get('/articles/*', async (req, res) => {
  let articleId = req._parsedUrl.pathname.substring(req._parsedUrl.pathname.lastIndexOf('/articles/') + 10, req._parsedUrl.pathname.length);

  Article.findOne({ _id: articleId })
    .populate('user', ['username', 'defaultImg'])
    .populate('comments')
    .exec(function (err, result) {
      Comment.find()
        .where('article', articleId)
        .exec((errArticles, resArticles) => {
          if (err) res.send(err);
          res.send(result);
        });
    });
});
// post article
app.post('/articles/', isLoggedIn, async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const article = new Article({ title: title, content: content, user: req.user });
  try {
    await article.save();
    res.send({ success: true, article: result, error: null, msg: 'Saved new Article!' });
    console.log('saved new article');
  } catch (err) {
    console.log(err);
  }
});
//get users
app.get('/users/', async (req, res) => {
  console.log(req.query);
  let filter = {};

  User.find(filter)
    .sort({ timestamp: -1 })
    .limit(20)
    .exec(function (err, result) {
      if (err) res.send(err);
      res.send(result);
    });
});
//get user
app.get('/users/*', async (req, res) => {
  let userId = req._parsedUrl.pathname.substring(req._parsedUrl.pathname.lastIndexOf('/users/') + 7, req._parsedUrl.pathname.length);
  User.findOne({ _id: userId }).exec(function (err, result) {
    if (err) res.send({});
    res.send(result);
  });
});
//get profile
app.get('/profile', async (req, res) => {
  User.findOne({ _id: req.user })
    .populate('user')
    .exec(function (err, result) {
      if (err) res.send({ success: true, error: err, user: null });
      res.send({ success: true, error: null, user: result });
    });
});
// like article
app.post('/like/', isLoggedIn, async (req, res) => {
  Article.findOne(
    { _id: req.body.article },
    {
      likes: { $elemMatch: { $eq: req.user } },
    }
  ).exec(function (error, result) {
    if (error) {
      res.send({ success: false, error: error, msg: 'Failed to like' });
    }
    if (result.likes.length) {
      try {
        Article.updateOne(
          { _id: req.body.article },
          {
            $inc: { likeCount: -1 },
            $pull: { likes: req.user._id },
          },
          function (error, result) {
            if (error) {
              res.send({ success: false, error: error, msg: 'Failed to unlike' });
            }
            res.send({ success: true, article: result, error: null, msg: 'Unliked!' });
          }
        );
      } catch (err) {
        res.send({ success: false, error: err, msg: 'Failed to unlike' });
      }

      return;
    }

    // try to like
    try {
      Article.updateOne(
        { _id: req.body.article },
        {
          $inc: { likeCount: 1 },
          $push: { likes: req.user._id },
        },
        function (error, result) {
          if (error) {
            res.send({ success: false, error: error, msg: 'Failed to like' });
          }
          res.send({ success: true, article: result, error: null, msg: 'Liked!' });
        }
      );
    } catch (err) {
      res.send({ success: false, error: err, msg: 'Failed to like' });
    }
  });
});

//update profile
app.put('/updateProfile', isLoggedIn, upload.single('img'), function (req, res, next) {
  let update = {
    username: sanitizeHtml(req.body.username),
    email: sanitizeHtml(req.body.email),
    web: sanitizeHtml(req.body.web),
    phone: sanitizeHtml(req.body.phone),
    firstName: sanitizeHtml(req.body.firstName),
    lastName: sanitizeHtml(req.body.lastName),
    bio: sanitizeHtml(req.body.bio),
    defaultImg: req.file.filename + '.jpg',
  };
  let user = null;

  try {
    User.findOneAndUpdate({ _id: req.user._id }, update, function (error, result) {
      if (error) {
        res.send({ success: false, msg: 'Something went wrong' });
      } else {
        user = result;
        console.log(result);
      }
    });
    console.log('updated user');
    let oldDir = 'tmp/' + req.file.filename;
    let newDir = '../client/public/uploads/users/' + req.user._id + '/';
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
    fs.rename(oldDir, newDir + req.file.filename + '.jpg', function (err) {
      if (err) throw err;
      console.log('successfully renamed');
    });
    res.send({ success: true, error: null, user: user, msg: 'Updated user' });
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err, user: null, msg: 'Failed to update user' });
  }
});
//get parties
app.get('/parties/', async (req, res) => {
  console.log('get parties');
  console.log(req.query);
  let filter = {};
  Party.find(filter).exec(function (err, result) {
    if (err) res.send(err);
    console.log(result);
    res.send(result);
  });
});

// check isLoggedIn
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({ success: false, msg: 'Not logged in' });
}

// start server
app.listen(environment.SERVER_PORT, () => {
  console.log(`App listening at http://localhost:${environment.SERVER_PORT}`);
});
