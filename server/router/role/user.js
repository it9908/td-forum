const express = require('express')
const connection = require('../../config/mysql')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const userRouter = express.Router()
userRouter.use(bodyParser.json())

// 用户注册
userRouter.post('/logon', (req, res) => {

    // 接收账号、密码
    const {username, password} = req.body;

    console.log(username, password)
    if (username.length < 5 || username.length > 12 || password.length < 6 || password.length > 12) {
        res.send({code: 201, message: "用户名或密码格式错误"})
        return
    }
    // 验证用户名格式
    const regexName = /^[a-zA-Z0-9]{5,11}$/
    // 验证密码格式
    const regexPwd = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/

    const isName = regexName.test(username);
    const isValid = regexPwd.test(password);
    if (isName && isValid) {
        const sql1 = "SELECT * FROM users WHERE username = ?"
        connection.query(sql1, [username], (error, results) => {
            if (error) {
                console.error("执行查询时发生错误:", error);
                res.send({message: "查询错误"});
                return;
            }

            if (results.length > 0) {
                // 用户名已存在
                console.log("用户名已存在");
                res.send({message: "用户名已存在"});
            } else {
                let img = [
                    "http://localhost:5000/upload/avatar/1.png",
                    "http://localhost:5000/upload/avatar/2.png",
                    "http://localhost:5000/upload/avatar/3.png"
                ]
                // 随机分配头像
                let randomImg = img[Math.floor(Math.random() * img.length)];
                // 注册时间
                const datetimeString = new Date();
                const sqlInsert = "INSERT INTO users (username, password, avatar_url, identity, create_time, update_time) VALUES (?, ?, ?, ?, ? ,?)";
                const params = [username, password, randomImg, 1, datetimeString, datetimeString]; // 替换为你的参数数组
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
        res.send({code: 201, message: "用户名或密码格式错误"})
    }
})

// 用户登录
userRouter.post('/login', (req, res) => {

    const {username, password} = req.body;
    // 执行查询语句，查找匹配的用户
    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
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
                    res.json({code: 200, token: token});
                } else {
                    // 登录失败，返回错误信息
                    res.json({code: 201, message: "亲您输入的账号或密码有误~~~"});
                }
            }
        }
    );
});

// 获取当前用户信息
userRouter.get('/current/userinfo', (req, res) => {

    // const token = req.headers.authorization;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({error: '未提供访问凭证'});
    }
    try {
        // 验证并解码 token
        const decoded = jwt.verify(token, 'my_key');

        // 在这里可以根据需要从数据库或其他数据源中获取用户信息
        const sql = 'SELECT * FROM users WHERE id = ?'
        connection.query(
            sql,
            [decoded.id],
            (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).json({error: '服务器错误'});
                } else {
                    if (results.length > 0) {
                        const user = results[0];
                        // 返回用户信息
                        res.json({
                            data: {
                                id: user.id,
                                username: user.username,
                                avatar: user.avatar_url
                            }
                        });
                    } else {
                        res.status(404).json({error: '用户不存在'});
                    }
                }
            }
        );
    } catch (error) {
        console.error('Error decoding token:', error);
        res.status(401).json({error: '无效的访问凭证'});
    }
});

// 获取帖子列表
userRouter.get('/getPostList', (req, res) => {
    // 执行查询
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
            res.status(200).send({total:totalCount, data:results})
        });
    });

})

// 用户获取自已发布的帖子
userRouter.get('/myposts', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({error: '缺少访问凭证'});
        return;
    }
    try {
        // 验证并解码 token
        const decoded = jwt.verify(token, 'my_key');
        // 在这里可以根据需要从数据库或其他数据源中获取用户信息
        const sql = 'SELECT * FROM posts WHERE user_id = ?'
        connection.query(
            sql,
            [decoded.id],
            (error, results) => {
                if (error) {
                    res.status(500).json({error: '服务器错误'});
                } else {
                    res.json(results);
                }
            }
        );
    } catch (error) {
        console.error('Error decoding token:', error);
        res.status(401).json({error: '无效的访问凭证'});
    }
})

// 用户删除帖子
userRouter.post('/del/myPosts', (req, res) => {
    //获取token
    const token = req.body.headers.Authorization
    //判断token是否存在
    if (!token) {
        res.sendStatus(400).json({err: "token不存在"})
        return
    }
    try {
        const decoded = jwt.verify(token, 'my_key')
        //获取帖子id
        const posts_id = req.body.data.posts_id
        //获取用户id
        const user_id = decoded.id
        //删除语句
        const sql = "DELETE FROM posts WHERE id = ? AND user_id = ?"

        connection.query(sql, [posts_id, user_id], (error, results) => {
            if (error) {
                res.json({code: 201, massage: "错误"})
                return
            }
            res.json({code: 200, massage: "删除成功"})
        })

    } catch (error) {
        res.sendStatus(401).json({err: "token无效"})
    }
})

// 用户修改帖子
// userRouter.post('/updatePostsById/:postsId', (req, res) => {
//     const {title, content} = req.body.formData
//     const posts_id = req.params.postsId
//
//     const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?"
//
//     connection.query(sql, [title, content, posts_id], (error, results) => {
//         if (error) {
//             res.json({code: 201, massage: "数据库错误"})
//             return
//         }
//         res.json({code: 200, massage: "修改成功"})
//     })
// })

// 获取评论
userRouter.get('/getComment/:postsId', (req, res) => {
    const postsId = req.params.postsId

    const countQuery = 'SELECT COUNT(*) AS total FROM comments WHERE post_id = ?';
    connection.query(countQuery, [postsId], (countError, countResults) => {
        if (countError) {
            res.json({massage: "错误"})
        } else {
            const totalItems = countResults[0].total;
            const sql = 'SELECT * FROM comments WHERE post_id = ?'
            connection.query(sql, [postsId], (error, results) => {
                if (error) {
                    res.json({a: postsId})
                    return
                }
                res.json({total: totalItems, data: results})
            })
        }
    })
})

// 发布评论
userRouter.post('/postComment', (req, res) => {
    //获取token
    const token = req.headers.authorization
    const {postId, content} = req.body
    console.log(postId, content);
    //判断token是否存在
    if (!token) {
        res.json({err: "token不存在"})
        return
    }

    try {

        const decoded = jwt.verify(token, 'my_key')
        //获取用户id
        const user_id = decoded.id
        const date = new Date()
        //删除语句
        const sql = 'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)'

        connection.query(sql, [postId, user_id, content, date], (error, results) => {
            if (error) {
                res.json({code: 201, massage: "发布失败"})
                return
            }
            res.json({code: 200, massage: "发布成功"})
        })

    } catch (error) {
        res.json({err: "token无效"})
        console.error(error)
    }
})

module.exports = userRouter