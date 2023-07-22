const jwt = require('jsonwebtoken')

// 创建一个中间件函数，用于验证token
function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(400).json({ err: "token不存在" });
    }

    try {
        const decoded = jwt.verify(token, 'my_key');
        req.userId = decoded.id; // 将解码后的token数据保存在请求对象中的 decodedToken 属性中
        next(); // 继续后续的请求处理
    } catch (error) {
        return res.sendStatus(401).json({ err: "token无效" });
    }
}

module.exports = verifyToken;