require('dotenv').config()

const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');

const cors = require('cors')

const app = express()
app.use(cors())
// 注册自定义中间件
app.use(bodyParser.json());

// 获取绝对路径
const uploadPath = path.join(__dirname,'./image');

// 将 upload 目录下的文件暴露为静态资源
app.use('/image', express.static(uploadPath));
// 将 upload 目录下的文件暴露为静态资源
// app.use('/upload', express.static(path.join()));

const serverHost = process.env.SERVER_HOST || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 3000;

// app.use('/upload', require('./router/upload/upload'))
app.use('/v1', require("./router/role/user"))
app.use('/v1', require("./router/forum"))
app.use('/v2', require("./router/role/admin"))
app.use('/v1', require('./router/'))
app.use('/test', require('./router/testRouter'))

app.listen(5000, () => {
  console.log(`Server started on port ${serverHost}:${serverPort}`);
});

module.exports = app





