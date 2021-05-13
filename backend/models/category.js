const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

// 板块分类Collection
module.exports = function () {
  const CategorySchema = new Schema({
    title: String,
    description: String,
    icon: String,
    icon_backgroundColor: String,
    count: Number, default: 0,
  });
  CategorySchema.plugin(mongoosePaginate);
  mongoose.model('category', CategorySchema);
};