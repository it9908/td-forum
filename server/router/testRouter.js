const express = require('express')
// 导入解析token中间件
const verifyToken = require('../utils/verifyToken')
const login = require('../models/user_login')
const logon = require('../models/user_logon')
const release = require('../models/publish_article')
const getPublishedArticles = require('../models/getPublishedArticles')

const router = express.Router()

// 登录
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    login(username, password)
        .then((response) => {
            // 处理登录成功的情况
            res.status(200).json(response);
        })
        .catch((error) => {
            // 处理登录失败的情况
            res.status(400).json(error);
        });
});

// 注册
router.post('/logon', (req, res) => {
    const {username, password} = req.body;
    logon(username, password)
        .then((response) => {
            // 处理登录成功的情况
            res.status(200).send(response);
        })
        .catch((error) => {
            // console.log(error)
            // 处理登录失败的情况
            res.status(401).send(error);
        });
})

// 发布
router.post('/release1', verifyToken, async (req, res) => {
    const data = req.body
    const userId = req.userId
    const identity = req.identity
    try {
        // 调用发布逻辑函数
        const publishResult = await release(data, userId, identity);
        // 发布成功，返回结果给客户端
        res.json(publishResult);
        console.log(publishResult)
    } catch (error) {
        // 发布失败，返回错误信息给客户端
        res.status(500).json({ error: "发布失败" });
    }
})

// 待审核稿件
router.get('/pendingReview/:pageNumber/:pageSize', verifyToken, async (req, res)=>{
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const pageSize = parseInt(req.params.pageSize) || 10;
    const offset = (pageNumber - 1) * pageSize;

    try {
        const data = await getPublishedArticles(pageSize, offset)
        res.json(data)
    } catch (error) {
        console.log(error)
        res.json(error)
    }

})

// 获取个人信息

module.exports = router