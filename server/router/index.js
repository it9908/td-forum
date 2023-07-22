const express = require('express')
const connection = require('../config/mysql')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const multer = require('../utils/multerConfig'); // 引入Multer配置文件
// 导入解析token中间件
const verifyToken = require('../utils/verifyToken')
// 验证账号、密码格式
const {isValidUsername, isValidPassword} = require('../utils/validator');

const router = express.Router()
router.use(bodyParser.json())

// 用户注册
router.post('/logon', (req, res) => {
    // 接收账号、密码
    const {username, password} = req.body;
    if (isValidUsername(username) && isValidPassword(password)) {
        const sql1 = "SELECT username FROM users WHERE username = ?"
        connection.query(sql1, [username], (error, results) => {
            if (error) {
                console.error("执行查询时发生错误:", error);
                res.send({message: "查询错误"});
                return;
            }

            if (results.length > 0) {
                // 用户名已存在
                res.send({message: "用户名已存在"});
            } else {
                let img = ["1.png", "2.png", "3.png"]
                console.log(img)
                // 随机分配头像
                let randomImg = img[Math.floor(Math.random() * img.length)];

                const serverHost = process.env.SERVER_HOST || 'http://localhost';
                const serverPort = process.env.SERVER_PORT || 5000;

                const avatarURL = `${serverHost}:${serverPort}/image/${randomImg}`;

                // 注册时间
                const datetimeString = new Date();
                const sqlInsert = "INSERT INTO users (username, password, avatar_url, identity, create_time, update_time) VALUES (?, ?, ?, ?, ? ,?)";
                const params = [username, password, avatarURL, 1, datetimeString, datetimeString]; // 替换为你的参数数组
                connection.query(sqlInsert, [...params], (error, results) => {
                    if (error) {
                        console.error("插入用户信息时发生错误:", error);
                        res.send({message: "注册失败"});
                    } else {
                        console.log("注册成功");
                        res.send({code: 200, message: "注册成功"});
                    }
                });
            }
        })
    } else {
        res.status(200).send({code: 201, message: "用户名或密码格式错误"})
    }
})

// 用户登录
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    // 数据验证：检查必需字段
    if (!username || !password) {
        return res.status(400).json({error: '用户名和密码为必填项'});
    }
    // 执行查询语句，查找匹配的用户
    connection.query(
        'SELECT id, username, avatar_url, identity FROM users WHERE username = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).json({error: '服务器错误'});
            } else {
                // 检查查询结果
                if (results.length > 0) {
                    // 登录成功，生成一个 token 作为登录凭证
                    const user = results[0]; // 假设只返回一个匹配的用户
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar_url,
                        identity: user.identity
                    }, 'my_key', {expiresIn: '24h'});
                    // 将 token 发送给客户端
                    res.status(200).json({code: 200, token: token, message: "success"});
                } else {
                    // 登录失败，返回错误信息
                    res.status(401).json({code: 401, message: "亲您输入的账号或密码有误~~~"});
                }
            }
        }
    );
})

// 获取帖子列表
router.get('/getPostList', (req, res) => {
    connection.query('SELECT COUNT(*) AS total_count FROM posts', (error, results) => {
        if (error) {
            console.error('Failed to execute query:', error);
            return;
        }
        // 获取总条数
        const totalCount = results[0].total_count;
        // 执行查询
        const sql2 = "SELECT posts.id, posts.title, " +
            "posts.content, posts.image_url, DATE_FORMAT(posts.publish_time, '%Y-%m-%d %H:%i:%s') AS publish_time, " +
            "users.username AS author_nickname, avatar_url FROM posts JOIN users ON posts.user_id = users.id"
        connection.query(sql2, (error, results) => {
            if (error) {
                console.error('Failed to execute query:', error);
                return;
            }
            res.status(200).send({code: 200, total: totalCount, data: results})
        });
    });
})

// 获取用户信息
router.get('/getUserInfoById', verifyToken, (req, res) => {
    const userId = req.userId
    const sql = 'SELECT id, username, avatar_url, identity FROM users WHERE id = ?'
    connection.query(sql, [userId], (error, results) => {
        if (error) {
            return
        }
        res.status(200).send({code: 200, data: results, message: "success"})
    })
})

// 获取已发布帖子
router.get('/ownPosts', verifyToken, (req, res) => {
    const userId = req.userId
    const sql = 'SELECT * FROM posts WHERE user_id = ?'
    connection.query(sql, [userId], (error, results) => {
        if (error) {
            return
        }
        res.status(200).send({code: 200, data: results, message: "success"})
    })
})

// 获取谋一篇帖子
router.get('/getPostsById/:postsId', (req, res) => {
    const {  }
})

// 发布帖子
router.post('/releasePosts', verifyToken, (req, res) => {

    // 获取标题、内容、图片名称
    // 这里图片已经上传服务器，我们只需使用拼接，存入图片地址
    const {title, content, image} = req.body;

    const serverHost = process.env.SERVER_HOST || 'http://localhost';
    const serverPort = process.env.SERVER_PORT || 5000;
    // 拼接图片url
    const imageURL = `${serverHost}:${serverPort}/image/${image}`;
    // 获取用户id
    const userId = req.userId
    // 获取当前时间作为发布时间
    const date = new Date()

    const params = [title, content, imageURL, date, userId]
    const sql = 'INSERT INTO posts (title, content, image_url, publish_time, user_id) VALUES (?, ?, ?, ?, ?)'
    connection.query(sql, [...params], (error, results) => {
        if (error) {
            res.json({code: 201, message: "error"})
            return
        }
        res.json({code: 200, message: "success"})
    })
})

// 上传图片
router.post('/upload/image', multer.single('file'), (req, res) => {
    // 返回上传成功的响应
    res.json({success: true, message: '图片上传成功', code: 200});
})

// 修改帖子
router.post('/updatePostsById/:postsId', verifyToken, (req, res) => {

    // 获取用户id
    const userId = req.userId
    // 获取要修改的帖子ID
    const postsId = req.params.postsId;

    const {title, content} = req.body
    const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?'
    connection.query(sql, [title, content, postsId, userId], (error, results) => {
        if (error) {
            res.status(401).send({message: "错误"})
            return
        } else {
            if (results.affectedRows < 1) {
                res.status(201).send({message: "修改失败~~"})
                return
            }
            res.status(200).send({message: "success"})
        }
    });
})

// 修改封面
router.post('/updateCoverById/:postsId', verifyToken, (req, res) => {
    // 获取图片名称
    const {coverName} = req.body

    const serverHost = process.env.SERVER_HOST || 'http://localhost';
    const serverPort = process.env.SERVER_PORT || 5000;
    // 拼接图片url
    const imageURL = `${serverHost}:${serverPort}/image/${coverName}`;

    console.log(imageURL)
    // 获取要修改的帖子ID
    const postsId = req.params.postsId;
    // 获取用户id
    const userId = req.userId

    const params = [imageURL, postsId, userId]
    const sql = 'UPDATE posts SET image_url = ? WHERE id = ? AND user_id = ?'
    connection.query(sql, [...params], (error, results) => {
        if (error) {
            res.status(401).send({message: "error"})
            return
        } else {
            if (results.affectedRows < 1) {
                res.status(201).send({message: "修改失败~~"})
                return
            }
            res.status(200).send({message: "success"})
        }
    });
})

// 更换头像
router.post('/updateAvatar', verifyToken, (req, res) => {
    // 获取图片名称
    const {imgName} = req.body

    const serverHost = process.env.SERVER_HOST || 'http://localhost';
    const serverPort = process.env.SERVER_PORT || 5000;
    // 拼接图片url
    const imageURL = `${serverHost}:${serverPort}/image/${imgName}`;

    // 获取用户id
    const userId = req.userId

    const params = [imageURL, userId]
    const sql = 'UPDATE users SET avatar_url = ? WHERE id = ?'
    connection.query(sql, [...params], (error, results) => {
        if (error) {
            res.status(401).send({message: "error"})
            return
        } else {
            if (results.affectedRows < 1) {
                res.status(201).send({message: "修改失败~~"})
                return
            }
            res.status(200).send({message: "success"})
        }
    });
})

// 修改密码
router.post('/updatePwd', verifyToken, (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const userId = req.userId;

    const sql1 = `SELECT password FROM users WHERE id = ?`;
    connection.query(sql1, [userId], (error, resPwd) => {
        if (error) {
            return;
        }
        // 获取数据库中存在的旧密码，与新密码匹配
        const passwordTrue = resPwd[0].password;

        // 验证输入的旧密码是否与数据库中存储的旧密码一致
        if (oldPassword !== passwordTrue){
            res.status(201).send({data: 201, message: "旧密码错误"});
            return;
        }

        // 验证旧密码是否与新密码重复
        if (oldPassword === newPassword) {
            res.status(201).send({message: "新密码不能与旧密码相同"});
            return;
        }

        // 不重复则验证密码格式、通过修改,反之
        if (!isValidPassword(newPassword)) {
            res.status(201).send({message: "新密码不能与旧密码相同"});
            return;
        }
        const params = [newPassword, userId];
        const sql2 = 'UPDATE users SET password = ? WHERE id = ?';
        connection.query(sql2, [...params], (error, results) => {
            if (error) {
                res.status(401).send({message: "error"});
                return;
            } else {
                if (results.affectedRows < 1) {
                    res.status(201).send({message: "修改失败~~"});
                    return;
                }
                res.status(200).send({message: "success"});
            }
        });
    });
});

module.exports = router;