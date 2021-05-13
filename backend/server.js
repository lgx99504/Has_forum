const express = require('express');
const session = require('express-session');
const { connectDB } = require("./db/index");
const config = require('./config');
const app = express();

//登录
app.use(session({
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));

const { User, Category, Topic, Reply } = require('./models');

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.post("/sessions", async (req, rsp) => {
  console.log(req.body);
  let user = await User.findOne({
    email: req.body.email, 
    password: req.body.password,
  }).exec();
  if (user) {
    req.session.user_id = user.id;
    rsp.status(200).json({status: 'ok', data: { user: user }});
  } else {
    rsp.status(200).json({status: 'error', error: "用户名或者密码错误"});
  }
})  

//注册账号
app.post("/users", (req, rsp) => {
  let password = req.body.password;
  let confirm_password = req.body.confirm_password;
  if (password.length == 0 || 
      confirm_password.lenth == 0 || 
      password != confirm_password) {
        rsp.status(200).json({status: 'error', error: "密码为空或者不一致"});
        return
  }

  let user = new User({
    email: req.body.email,
    password: password,
    created_at: new Date().toUTCString(),
  });
  user.save((err, rec) => {
    if (err) {
      rsp.status(200).json({status: "error", error: JSON.stringify(err)})
    } else {
      rsp.status(200).json({status: 'ok', data: { user: rec }});
    }
  })
})


//修改密码
app.post("/users/change_password", async (req, rsp) => {
  let user = await User.findOne({_id: req.body.user_id}).exec();
  if (!user) {
    rsp.status(200).json({status: 'error', error: "未找到用户"});
    return
  }

  let password = req.body.password;
  let confirm_password = req.body.confirm_password;
  let old_password = req.body.old_password;
  if (user.password != old_password) {
    rsp.status(200).json({status: "error", error: "旧密码不正确！"})
    return
  }

  if (password.length == 0 || 
      confirm_password.length == 0 || 
      password != confirm_password) {
        rsp.status(200).json({status: 'error', error: "密码为空或者不一致"});
        return
  }

  user.password = password;
  user.save((err, rec) => {
    if (err) {
      rsp.status(200).json({status: "error", error: JSON.stringify(err)})
    } else {
      rsp.status(200).json({status: 'ok', data: { user: rec }});
    }
  })
})

//退出登录
app.post("/logout", (req, rsp) => {
  req.session.user_id = null;
  rsp.status(200).json({status: 'ok'});
})

// 创建分类
app.post("/categories", (req, rsp) => {
  let cate = new Category({
    title: req.body.title, 
    description: req.body.description,
    icon: req.body.icon,
    icon_backgroundColor: req.body.icon_backgroundColor,
    count: 0
  });

  cate.save((err, rec) => {
    if (err) {
      rsp.status(200).json({status: "error", error: JSON.stringify(err)});
    } else {
      rsp.status(200).json({status: 'ok', data: { category: rec }});  
    }
  })
})

// 获取分类列表
app.get("/categories", (req, rsp) => {
  Category.find({}, {}, { sort: { _id: 'desc' } }, (err, rows) => {
    if (err) {
      rsp.status(200).json({status: "error", error: JSON.stringify(err)})
    } else {
      rsp.status(200).json({status: 'ok', data: { categories: rows }});  
    }
  })
})

// 帖子列表
app.get("/categories/:id", (req, rsp) => {
  Topic.find({category_id: req.params.id}, {}, { sort: { _id: 'desc' } }, (err, rows) => {
    if (err) {
      rsp.status(200).json({status: "error", error: JSON.stringify(err)})
    } else {
      rsp.status(200).json({status: 'ok', data: { topics: rows}});  
    }
  })
})

// 帖子详情
app.get("/topics/:id", async (req, rsp) => {
  let topic = await Topic.findOne({_id: req.params.id}).exec();
  let replies = await Reply.find({topic_id: req.params.id}, {}, {sort: {_id: 'desc'}}).exec();  
  rsp.status(200).json({
    status: 'ok', 
    data: { 
      topic: topic,
      replies: replies,
        
    },
  });  
})

// 创建帖子
app.post("/topics/:category_id", (req, rsp) => {
  User.findOne({_id: req.body.user_id},function(err, user){
    if(!err){
      let topic = new Topic({
        title: req.body.title,
        content: req.body.content,
        category_id: req.params.category_id,
        user_id: req.body.user_id,
        user_name: user.email,
        created_at: new Date().toUTCString(),
        count: 0
      });
      Category.findOne({_id: req.params.category_id}, function(error, doc){
        if (error){
    
        }else{
          if (doc.count){
            doc.count = doc.count + 1
            doc.save()
          }else{
            doc.count = 1
            doc.save()
          }
        }
      });
      topic.save((err, rec) => {
        if (err) {
          rsp.status(200).json({status: "error", error: JSON.stringify(err)})
        } else {
          rsp.status(200).json({status: 'ok', data: { topic: rec }});
        }
      })
    }else{
      rsp.status(200).json({status: 'error'});
    }
  })
})

// 创建回复
app.post("/replies/:topic_id", (req, rsp) => {
  User.findOne({_id: req.body.user_id},function(err, user){
    if(err){
      rsp.status(200).json({status: "error"})
    }else{
      let reply = new Reply({
        content: req.body.content,
        topic_id: req.body.topic_id,
        user_id: req.body.user_id,
        user_name: user.email,
        created_at: new Date().toUTCString(),
      });
      Topic.findOne({_id: req.body.topic_id},function(error, doc){
        if(!error){
          if (doc.count){
            doc.count = doc.count + 1
            doc.save();
          }else{
            doc.count = 1
            doc.save();
          }
        }
      });
     
      reply.save((err, rec) => {
        if (err) {
          rsp.status(200).json({status: "error", error: JSON.stringify(err)})
        } else {
          rsp.status(200).json({status: 'ok', data: { reply: rec }});
        }
      })
    }
  })
})

//搜索
app.get("/search/:title", (req, rsp) => {
  let search =  req.params.title;
  Topic.find({title: new RegExp(search)},function(error, doc){
    if(error){
      rsp.status(200).json({status: "error"})
    }else{
      console.log(doc)
      rsp.status(200).json({status: "ok", data: doc})
    }
  })
})

//删除板块
app.post("/cate/:id",(req, rsp) => {
  Category.findByIdAndDelete(req.params.id, function(error, doc) {
    if (error){
      rsp.status(200).json({status: "error", error: JSON.stringify(error)})
    }else{
      rsp.status(200).json({status: "ok"})
    }
  });
})

//创建admin
app.post("/set_admin", (req, rsp) => {
  User.findOne({_id: req.body.id}, function(error, doc){
    if(error){
      rsp.status(200).json({status: "error"})
    }else{
      doc.is_admin = !doc.is_admin
      doc.save(function(err, user) {
        if (err){
          rsp.status(200).json({status: "error"})
        }else{
          rsp.status(200).json({status: "ok", data: {user: user}})    
        }
      })
    }
  })
})

app.listen(config.PORT, () => {
  connectDB();
  console.log(`server listening at http://localhost:${config.PORT}`)
})
