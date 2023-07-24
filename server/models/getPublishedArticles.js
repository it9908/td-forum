const connection = require('../config/mysql');

// 分页查询已发布的稿件
async function getPublishedArticles(pageSize, offset) {
    try {
        const status = 1;
        // 获取总条数
        const total = await getTotalPublishedArticles();
        // 分页查询
        const sql2 = `
            SELECT 
                posts.id,
                posts.title,
                posts.cover,
                posts.content,
                DATE_FORMAT(posts.create_time, '%Y-%m-%d %H:%i:%s') AS publish_time,
                posts.status,
                users.username AS author_nickname,
                users.avatar_url,
                GROUP_CONCAT(tags.name) AS tags_list
                FROM 
                    posts 
                JOIN 
                    users 
                ON 
                    posts.user_id = users.id
                LEFT JOIN
                    tags
                ON
                    posts.id = tags.post_id
                WHERE 
                    posts.status = ?
                GROUP BY
                    posts.id
                LIMIT 
                    ?
                OFFSET 
                    ?;
         `;
        const results = await queryDatabase(sql2, [status, pageSize, offset]);
        console.log(results)
        return {total, data: results};
    } catch (error) {
        throw error;
    }
}

// 总条数
function getTotalPublishedArticles() {
    return new Promise((resolve, reject) => {
        const status = 1;
        const sql = 'SELECT COUNT(*) AS total FROM posts WHERE status = ?';
        connection.query(sql, [status], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total);
            }
        });
    });
}

// 封装数据库查询
async function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = getPublishedArticles
