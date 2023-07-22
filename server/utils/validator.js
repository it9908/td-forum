
// 验证用户名格式
function isValidUsername(username) {
    const regexName = /^[a-zA-Z0-9]{5,11}$/;
    return regexName.test(username);
}

// 验证密码格式
async function isValidPassword(password) {
    const regexPwd = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
    return regexPwd.test(password);
}

module.exports = {
    isValidUsername,
    isValidPassword,
};
