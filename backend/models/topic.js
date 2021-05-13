const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

// 帖子Collection
module.exports = function () {
    const TopicSchema = new Schema({
      title: String,
      content: String,
      category_id: mongoose.ObjectId,
      user_name: String,
      user_id: mongoose.ObjectId,
      count: Number, default: 0,
      created_at: Date,
    });
    TopicSchema.plugin(mongoosePaginate);
    mongoose.model('topic', TopicSchema);
  };