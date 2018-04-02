# [xzh.mip.xuexb.com](https://xzh.mip.xuexb.com)

MIP 网站应用熊掌号登录示例

![node version required](https://img.shields.io/badge/node-%3E=7.8.0-red.svg)

## 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
export MIP_XZH_CLIENT_ID=client_id
export MIP_XZH_SECRET=密钥

# 运行示例
npm start

# 打开浏览器
open http://127.0.0.1:3001/test.html
```

## API 接口

- [判断登录](#check)
- [登录](#登录)
- [退出](#退出)

## Nginx 配置

<https://github.com/xuexb/nginx-conf/blob/master/conf/xuexb/xzh.mip.xuexb.com.conf>

## License

MIT
