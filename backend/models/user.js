const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

//用户Collection
module.exports = function () {
  const UserSchema = new Schema({
    email: String,
    cellphone: String,
    password: String,
    username: String,
    is_admin: Boolean, default: false,
    created_at: Date,
  });
  UserSchema.plugin(mongoosePaginate);
  mongoose.model('user', UserSchema);
};