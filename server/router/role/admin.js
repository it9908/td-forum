const express = require('express')
const connection = require('../../config/mysql')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const moment = require('moment')


const adminRouter = express.Router()
adminRouter.use(bodyParser.json())

//获取全部用户信息
adminRouter.get('/test/getUserList', (req, res) => {
    const sql = "SELECT * FROM users"
    connection.query(sql, (error, results) => {
        if (error) {
            // 如果查询出错，返回错误信息
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        // 返回查询结果
        res.json(results);
    });
})

// 获取全部用户信息
adminRouter.get('/getUserList', (req, res) => {
    // 在这里处理解码后的 token 数据
    const sql = "SELECT * FROM users"
    connection.query(sql, (error, results) => {
        if (error) {
            // 如果查询出错，返回错误信息
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        // 返回查询结果
        res.json(results);
    });
})

// 分页查询
adminRouter.get('/users/:currentPage/:pageSize', (req, res) => {
    const currentPage = parseInt(req.params.currentPage) || 1;
    const pageSize = parseInt(req.params.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 查询总条目数
    const countQuery = 'SELECT COUNT(*) AS total FROM users';
    connection.query(countQuery, (countError, countResults) => {
        if (countError) {
            console.error(countError);
            res.status(500).json({ error: 'Server error' });
        } else {
            const totalItems = countResults[0].total;
            // 分页查询
            const query = "SELECT id,username,password,avatar_url,identity,DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') AS create_time,DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') AS update_time FROM users LIMIT ? OFFSET ? ";
            connection.query(query, [pageSize, offset], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    // 返回分页结果
                    res.json({
                        currentPage,
                        pageSize,
                        totalItems,
                        totalPages: Math.ceil(totalItems / pageSize),
                        items: results,
                    });
                    console.log(results);
                }
            });
        }
    });
})

// 根据id查询用户
adminRouter.get('/getUserInfoById/:id', (req, res) => {
    console.log(req.params.id)
    const id = req.params.id
    const sql = "SELECT id,username,password,avatar_url,identity,DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') AS create_time,DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') AS update_time FROM users WHERE id = ?"
    connection.query(sql, [id], (error, results) => {
        if (error) {
            res.status(201).json({ err: "错误" })
            return
        }
        res.status(200).send({ code:200, message:"查找成功", data: results })
    })
})

// 根据名字（账号）查询
adminRouter.get('/getUserInfoByName/:username', (req, res) => {
    const name = req.params.username
    const sql = "SELECT * from users where username like ?"
    connection.query(sql, [`%${name}%`], (error, results) => {
        if (error) {
            res.json({ code: 403, message: "错误" })
            return
        }
        res.status(200).send({ code:200, message:"查找成功", data: results })
    })
})

// 根据id删除用户
adminRouter.post('/delUser/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM users WHERE id = ?"
    connection.query(sql, [id], (error, results) => {
        if (error) {
            res.json({ code:403, message: "删除失败" })
            return
        }
        res.status(200).json({ code: 200, message: "删除成功" })
    })
})

// 删除多个用户
adminRouter.post('/delUsers', (req, res) => {
    console.log(req.body);
    const ids = req.body
    const isArr = Array.isArray(ids)
    // 判断参数是否为数组类型
    if(!isArr){
        res.send({code:201,message:"参数错误~~~"})
        return
    }
    const sql = "DELETE FROM users WHERE id IN (?)";

// 执行 SQL 查询并传递参数
    connection.query(sql, [ids], function (error, results, fields) {
        if(error){
            res.send({code:403,data:"删除失败~"})
            return
        }
        res.send({code:200,message:"success"})
    });
})

// 根据id修改用户权限
adminRouter.post('/updateUserInfo/:id', (req, res) => {
    const id = req.params.id
    const { identity } = req.body
    if (typeof identity === 'number' && (identity === 1 || identity === 2)) {
        const sql = 'UPDATE users SET identity = ? WHERE id = ?'
        const params = [identity, id]
        connection.query(sql, params, (error, results) => {
            if (error) {
                res.json({ code: 403, message: "修改失败" })
            } else {
                // 处理结果
                res.json({ code: 200, message: "修改成功" })
            }
        });
    } else {
        res.json({ code: 201, message: "权限只能为1或2" })
    }
})


// 根据新闻id查找
adminRouter.get('/getPostsById/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM posts WHERE id = ${id}`
    connection.query(sql, (error, results) => {
        if (error) {
            res.json({ err: "err" })
            return
        }
        res.status(200).json({code:200,data: results})
    })
})

// 根据新闻user_id查找
adminRouter.get('/getPostsByUserId/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM posts WHERE user_id = ${id}`
    connection.query(sql, (error, results) => {
        if (error) {
            res.json({ err: "err" })
            return
        }
        res.status(200).json({code:200,data:results})
    })
})

// 根据id删除帖子
adminRouter.post('/delPosts/:id', (req, res) => {
    // console.log(req)
    const id = req.params.id
    const sql = "DELETE FROM posts WHERE id = ?"
    connection.query(sql, [id], (error, results) => {
        if (error) {
            res.json({ err: "err" })
            return
        }
        res.status(200).json({ code: 200, ok: "删除成功" })
    })
})

// 多选删除帖子
adminRouter.post('/delSelectPost', (req, res) => {
    const ids = req.body
    const isArr = Array.isArray(ids)
    // 判断参数是否为数组类型
    if(!isArr){
        res.send({code:201,message:"参数错误~~~"})
        return
    }
    const sql = "DELETE FROM posts WHERE id IN (?)";

// 执行 SQL 查询并传递参数
    connection.query(sql, [ids], function (error, results, fields) {
        if(error){
            res.send({code:403,data:"删除失败~"})
            return
        }
        res.send({code:200,message:"success"})
    });
})

// 修改帖子
adminRouter.post('/updatePosts/:id', (req, res) => {
    // console.log(req.body);
    const id = req.params.id
    console.log(id);
    const { title, content } = req.body
    const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?'
    connection.query(sql, [title, content, id], (error, results) => {
        if (error) {
            res.json({ err: "错误" })
        } else {
            // 处理结果
            res.json({ cg: "成功" })
        }
    });
})

// 全部评论
adminRouter.get('/getComment', (req, res) => {
    const sql = "SELECT * FROM comments"
    connection.query(sql, (error, results) => {
        if (error) {
            res.json({ err: "错误" })
        } else {
            // 处理结果
            res.json(results)
        }
    });
})

// 删除评论
adminRouter.post('/delComment/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM comments WHERE id = ${id}`
    connection.query(sql, (error, results) => {
        if (error) {
            res.json({ err: "错误" })
        } else {
            // 处理结果
            res.json({ cg: "成功" })
        }
    });
})

// 帖子分页
adminRouter.get('/items/:currentPage/:pageSize', (req, res) => {
    const currentPage = parseInt(req.params.currentPage) || 1;
    const pageSize = parseInt(req.params.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 查询总条目数
    const countQuery = 'SELECT COUNT(*) AS total FROM posts';
    connection.query(countQuery, (countError, countResults) => {
        if (countError) {
            console.error(countError);
            res.status(500).json({ error: 'Server error' });
        } else {
            const totalItems = countResults[0].total;

            // 分页查询
            const query = 'SELECT * FROM posts LIMIT ? OFFSET ?';
            connection.query(query, [pageSize, offset], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    // 返回分页结果
                    res.json({
                        currentPage,
                        pageSize,
                        totalItems,
                        totalPages: Math.ceil(totalItems / pageSize),
                        items: results,
                    });
                }
            });
        }
    });
})

module.exports = adminRouter