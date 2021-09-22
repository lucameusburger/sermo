const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  web: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  defaultImg: {
    type: String,
    required: false,
  },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
