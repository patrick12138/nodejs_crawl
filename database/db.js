const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'node', // 数据库名
    'root', // 用户名
    'xwh12138', // 用户密码
    {
        'dialect': 'mysql', // 数据库使用mysql
        'host': 'localhost', // 数据库服务器ip
        'port': 3306, // 数据库服务器端口
        'define': {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            'underscored': true
        },
        // 建立连接池
        pool: {
            max: 5, // 连接池中最大连接数量
            min: 0, // 连接池中最小连接数量
            idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
        }
    }
);

sequelize
    .authenticate()
    .then(res => {
        console.log('数据库连接【成功】!')
    })
    .catch(err => {
        console.log('数据库连接【失败】!')
    });

module.exports = {
    sequelize
}