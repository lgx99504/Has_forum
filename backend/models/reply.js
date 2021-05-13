const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

// 回复Collection
module.exports = function () {
    const ReplySchema = new Schema({
      content: String,
      topic_id: mongoose.ObjectId,
      user_id: mongoose.ObjectId,
      user_name: String,
      created_at: Date,
    });
    ReplySchema.plugin(mongoosePaginate);
    mongoose.model('reply', ReplySchema);
  };