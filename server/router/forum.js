const express = require('express')
const connection = require('../config/mysql')

const router = express.Router()

router.get('/homePage/postsList', (req, res) => {
    const sql = "SELECT id, title, image_url FROM posts"
    connection.query(sql, (error, results) => {
        if (error) {
            res.send({code: 201, message: "查询错误"})
        }
        // 定义长度为 10 的数组
        const array = results;

// 随机筛选四个元素的函数
        function getRandomElements(array, count) {
            // 复制原始数组
            const copiedArray = [...array];
            const result = [];

            // 筛选随机元素
            for (let i = 0; i < count; i++) {
                // 生成随机索引
                const randomIndex = Math.floor(Math.random() * copiedArray.length);

                // 从复制的数组中取出随机元素，并从原数组中移除该元素
                const randomElement = copiedArray.splice(randomIndex, 1)[0];

                // 将随机元素添加到结果数组中
                result.push(randomElement);
            }

            return result;
        }

// 筛选四个随机元素
        const resData = getRandomElements(array, 4);
        res.send({code: 200, message: "success", data: resData})
    })
})

module.exports = router