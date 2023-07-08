import jwt_decode from 'jwt-decode'

// 解码令牌获取身份信息
export function decodeToken(token) {
    try {
        // 假设使用 jwt-decode 库解析令牌
        return jwt_decode(token);
    } catch (error) {
        console.error('解码令牌失败:', error);
        return null;
    }
}
