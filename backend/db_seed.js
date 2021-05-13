const { connectDB, generateTestData } = require("./db/index");

//测试数据
(function (){
  connectDB();
  generateTestData();
})()