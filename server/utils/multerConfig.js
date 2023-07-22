const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// 设置存储引擎和上传目录
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './image'; // 所有文件存放目录
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4(); // 使用 UUID 生成唯一标识
        const fileExtension = getFileExtension(file.originalname); // 获取文件后缀名
        cb(null, uniqueFilename + fileExtension);
    }
});

// 获取文件后缀名的函数
function getFileExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
        return fileName.slice(lastDotIndex); // 包含点的后缀名，例如：".png" 或 ".jpg"
    }
    return ''; // 没有后缀名的情况
}

// 导出 Multer 实例，配置存储引擎和其他选项
module.exports = multer({storage});
