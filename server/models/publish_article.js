const jwt = require('jsonwebtoken');
const connection = require('../config/mysql');
const MarkdownIt = require('markdown-it'); // 处理返回的markdown格式内容

// 发布
async function release(params, userId, identity){
    try{
        checkObjectProperties(params)
        const processedParams  = await handleParams(params,userId,identity)
        //  返回一个postId
        const result = await addPosts(processedParams)
        // 添加标签信息，并传入 postId 和标签列表
        return await addTags(result, params.tags)
    } catch (error) {
        console.log(error);
        return { error: '发布失败' };
    }
}

// 处理参数格式
function checkObjectProperties(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (!obj[key]) {
            throw new Error(`${key}不能为空`);
        }
    }
}

// 处理参数
async function handleParams(params, userId, identity){
    // 获取标题、内容、图片名称
    // 这里图片已经上传服务器，我们只需使用拼接，存入图片地址
    const data = params
    const {title, cover, content} = data
    console.log(data)
    const serverHost = process.env.SERVER_HOST || 'http://localhost';
    const serverPort = process.env.SERVER_PORT || 5000;
    // 拼接图片url
    const cover_url = `${serverHost}:${serverPort}/image/${cover}`;
    // 处理markdown格式
    const md = new MarkdownIt()
    const content_html = md.render(content)
    console.log(content_html)
    // 获取用户id
    const user_id = userId
    // 获取当前时间作为发布时间
    const create_time = new Date()
    // 获取当前时间作为操作时间
    const update_time = new Date()
    let status = 1
    console.log(identity)
    if(identity === 2){
        status = 2
    }
    console.log(status)
    const paramsArr = [title, cover_url, content_html, create_time, update_time, user_id, status]
    // 返回参数
    return paramsArr
}

// 插入posts表
function addPosts(params){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO posts (title, cover, content, create_time, update_time, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [...params], (error, results) => {
            if (error) {
                console.log(error);
                reject({ error: '发布失败' }); // 返回错误信息
            } else {
                resolve(results.insertId); // 返回成功结果
            }
        });
    });
}

// 插入tags表
function addTags(postId, tagList){
    console.log(postId, tagList)
    // 插入标签信息到 tags 表
    return new Promise((resolve, reject) => {
        // 插入标签信息到 tags 表
        const insertTagSql = 'INSERT INTO tags (post_id, name) VALUES (?, ?)';
        const promises = [];

        tagList.forEach((tag) => {
            const promise = new Promise((resolve, reject) => {
                connection.query(insertTagSql, [postId, tag], (error) => {
                    if (error) {
                        console.log(error);
                        reject(error); // 插入失败时，返回错误信息
                    } else {
                        resolve(); // 插入成功时，返回空
                    }
                });
            });
            promises.push(promise);
        });

        // 使用 Promise.all() 来等待所有插入操作完成
        Promise.all(promises)
            .then(() => {
                resolve({code:200,message:"发布成功"}); // 所有标签插入成功，返回空
            })
            .catch((error) => {
                reject(error); // 有任何一个标签插入失败，返回错误信息
            });
    });

}

module.exports = release