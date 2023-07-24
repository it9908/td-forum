const jwt = require('jsonwebtoken');
const connection = require('../config/mysql'); // 这里需要替换为你实际的数据库连接模块
const { isValidUsername, isValidPassword } = require('../utils/validator')


// 注册方法
function logon(username, password) {
    return new Promise( async (resolve, reject) => {
        try {
            const results = await addUser(username, password);
            resolve(results)
        } catch (error) {
            console.error('Error querying database:', error);
            reject({code: 500,error: '服务器错误'});
        }
    });
}

// 验证用户名是否已存在
function isUsernameExists(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM users WHERE username = ?';
        connection.query(sql, [username], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // 如果查询结果不为空，说明用户名已存在
                const exists = results.length > 0;
                resolve(exists);
            }
        });
    });
}

// 添加至数据库
async function addUser(username, password) {
    try{
        const usernameExists = await isUsernameExists(username);
        if (usernameExists) {
            throw { code:201, message: '用户名已存在' };
        }
        if (!isValidUsername(username) || !isValidPassword(password)) {
            throw { code:201, message: '用户名或密码格式错误' };
        }
        let img = ["image1.png", "image2.png", "image3.png"]

        // 随机分配头像
        let randomImg = img[Math.floor(Math.random() * img.length)];

        const serverHost = process.env.SERVER_HOST || 'http://localhost';
        const serverPort = process.env.SERVER_PORT || 5000;
        // 头像链接拼接
        const avatar_url = `${serverHost}:${serverPort}/image/${randomImg}`;
        // 默认签名
        const personal_signature = "还未有个性签名，快写点什么吧！"
        // 默认权限
        const identity = 1
        // 获取注册时间
        const create_time = new Date();
        // 获取操作时间
        const update_time = new Date();
        // 默认状态 1
        const status = 1

        const params = [username, password, avatar_url, personal_signature, identity, create_time, update_time, status];

        const sqlInsert = 'INSERT INTO users (username, password, avatar_url, personal_signature, identity, create_time, update_time, status) VALUES (?, ?, ?, ?, ? ,?, ?,?)'
        return new Promise((resolve, reject) => {
            connection.query(sqlInsert, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ code: 200, message: '注册成功' });
                }
            });
        })
    } catch (error) {
        return error
    }
}

module.exports = logon
