const mongoose = require('mongoose');
require('./user')();
require('./category')();
require('./topic')();
require('./reply')();

module.exports = {
  User: mongoose.model('user'),
  Category: mongoose.model('category'),
  Topic: mongoose.model('topic'),
  Reply: mongoose.model('reply'),
}