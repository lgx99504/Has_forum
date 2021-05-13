const mongoose = require('mongoose');
const config = require('../config');
const faker = require('faker');
const { User, Category,Topic,Reply } = require('../models');


//链接数据库
async function connectDB() {
  await mongoose.connect(config.MONGO_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}

//生成测试数据
function generateTestData() {
  var ops = [];
  for (let i = 0; i < 10; ++i) {
    ops.push(User.create({
      username: faker.name.findName(),
    }));

    ops.push(Category.create({
      title: faker.name.findName(),
    }));
  }
  Promise.all(ops).then(() => {
    console.log("done!");
    mongoose.disconnect();
  });
}

module.exports = {
  connectDB,
  generateTestData,
}