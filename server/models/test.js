const markdownText = `今天天气很好
1.
![1688645037763.jpg](1)
2.
![brucetangnKO_1QyFh9ounsplash.jpg](2)`;

// 定义一个正则表达式来匹配图片标签
const regex = /!\[(.*?)\]\((.*?)\)/g;

// 使用replace方法来替换匹配的图片标签为链接
const processedMarkdown = markdownText.replace(regex, (match, altText, fileName) => {
    // 假设你有一个存放图片的服务器地址，比如'https://example.com/images/'
    const imageServerURL = 'https://example.com/images/';

    // 根据文件名构建图片链接
    const imageURL = imageServerURL + fileName;

    // 返回替换后的链接格式
    return `[${altText}](${imageURL})`;
});

console.log(processedMarkdown);
