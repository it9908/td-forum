// 导入所需的依赖
const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const connection = require('../../config/mysql')
const bodyParser = require('body-parser')

const multer = require('multer')
const routerUpload = express.Router()

routerUpload.use(bodyParser.json())

// 设置存储引擎和上传目录
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("file.fieldname:" + file.fieldname);
    let uploadPath = '';
    if (file.fieldname === 'image') {
      uploadPath = './upload/posts'; // 图片存放目录
    } else if (file.fieldname === 'avatar') {
      uploadPath = './upload/avatar'; // 头像存放目录
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// 创建 Multer 实例，配置存储引擎和其他选项
const upload = multer({ storage });

// 上传图片
routerUpload.post('/image', upload.single('image'), (req, res) => {
  // 文件已成功上传，处理相关逻辑
  // 可以在 req.file 对象中获取上传的文件信息
  console.log(req.file);
  // 返回上传成功的响应
  res.json({ success: true, message: '图片上传成功' });
});

// 上传头像
routerUpload.post('/avatar', upload.single('avatar'), (req, res) => {
  console.log(req.file);

  // 返回上传成功的响应
  res.json({ success: true, message: '图片上传成功' });
});

// 更换头像
routerUpload.post('/replace/avatar/:fileName', (req, res) => {
  //获取token
  const token = req.body.headers.Authorization
  console.log(req.params.fileName);
  const imgName = req.params.fileName
  const avatar_url = 'http://localhost:5000/upload/avatar/'+imgName
  if (!token) {
    // 如果请求中没有 token 参数，返回错误信息
    res.status(400).json({ error: '没有token' })
    return
  }

  // 使用 jsonwebtoken 库对 token 进行解码
  const decoded = jwt.verify(token, 'my_key');
  const id = decoded.id
  console.log({ avatar_url, id });
  const sql = 'UPDATE users SET avatar_url = ? WHERE id = ?'
  connection.query(sql, [avatar_url, id], (error, results) => {
    if (error) {
      res.json({ code: 201, massage: "error" })
      return
    }
    res.json({ code: 200, massage: "更换成功" })
  })
})
// 发布帖子
routerUpload.post('/posts/create', upload.single('image'), (req, res) => {
  //获取token
  const token = req.headers.authorization
  if (!token) {
    // 如果请求中没有 token 参数，返回错误信息
    res.status(400).json({ error: '没有token' })
    return
  }

  // 获取帖子标题和内容
  console.log(req.body)
  const { title, content } = req.body;
  // 获取上传的图片信息
  // console.log(req.file)
  const image = req.file.originalname;
  const data = new Date()
  const imageUrl = `http://localhost:5000/upload/posts/image/${image}`;

  // 使用 jsonwebtoken 库对 token 进行解码
  const decoded = jwt.verify(token, 'my_key');
  const user_id = decoded.id
  console.log({ title, content, imageUrl, data, user_id });
  const sql = 'INSERT INTO posts (title, content, image_url, publish_time, user_id) VALUES (?, ?, ?, ?, ?)'
  connection.query(sql, [title, content, imageUrl, data, user_id], (error, results) => {
    if (error) {
      res.json({ code: 201, massage: "error" })
      return
    }
    res.json({ code: 200, massage: "成功" })
  })
});

// 访问图片
routerUpload.get('/posts/image/:filename', (req, res) => {
  const filename = req.params.filename;
  // 获取图片文件的路径
  const imagePath = path.resolve(__dirname, '../../upload/posts', filename);
  // 返回图片
  res.sendFile(imagePath);
})

//访问头像
routerUpload.get('/avatar/:filename', (req, res) => {
  const filename = req.params.filename;
  // 获取图片文件的路径
  const imagePath = path.resolve(__dirname, '../../upload/avatar', filename);
  // 返回图片
  res.sendFile(imagePath);
})

module.exports = routerUpload;
