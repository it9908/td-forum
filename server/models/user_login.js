const jwt = require('jsonwebtoken');
const connection = require('../config/mysql'); // 这里需要替换为你实际的数据库连接模块

// 登录
function login(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const results = await queryUser(username, password);

            // 检查查询结果
            if (results.length > 0) {
                // 登录成功，生成一个 token 作为登录凭证
                const user = results[0]; // 假设只返回一个匹配的用户
                if (user.status === 2) {
                    // 登录失败，账号已被封禁
                    return reject({ code: 403, message: '亲您的账号已被封禁，请联系管理员' });
                }
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar_url,
                        identity: user.identity
                    },
                    'my_key',
                    {expiresIn: '24h'}
                );
                // 将 token 发送给客户端
                resolve({code: 200, token: token, message: 'success'});
            } else {
                // 登录失败，返回错误信息
                reject({code: 401, message: '亲您输入的账号或密码有误~~~'});
            }
        } catch (error) {
            console.error('Error querying database:', error);
            reject({error: '服务器错误'});
        }
    });
}

// 查找账号密码是否正确
function queryUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT id, username, avatar_url, identity FROM users WHERE username = ? AND password = ?';
        connection.query(sql, [username, password], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = login
