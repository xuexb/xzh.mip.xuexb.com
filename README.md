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
- [登录](#login)
- [退出](#logout)

<a href="#check" id="check" name="check"></a>
### 判断登录

#### 接口地址

<https://xzh.mip.xuexb.com/api/userinfo.json>

#### 请求类型

POST

#### 请求参数
参数名 | 说明
--- | ---
`type` | `check` - 固定参数

#### 返回值

已登录：
```json
{
    "status": 0,
    "data": {
        "name": "mip"
    }
}
```

未登录：
```json
{
    "status": 0,
    "data": {}
}
```

<a href="#login" id="login" name="login"></a>
### 登录

#### 接口地址

<https://xzh.mip.xuexb.com/api/userinfo.json>

#### 请求类型

POST

#### 请求参数
参数名 | 说明
--- | ---
`type` | `login` - 固定参数
`code` | 授权回调回传参数，需要在获取 `access_token` 时使用
`redirect_uri` | 回调链接，需要在获取 `access_token` 时使用

源站后端服务需要使用 `code` 和 `redirect_uri` 参数去请求 [获取网页授权access_token](http://xiongzhang.baidu.com/open/wiki/chapter2/section2.2.html?t=1522129995153) 、[获取授权用户信息](http://xiongzhang.baidu.com/open/wiki/chapter2/section2.4.html?t=1522129995153) 接口，并和源站的用户关联、记录用户登录状态。

#### 返回值

处理且登录成功：
```json
{
    "status": 0,
    "data": {
        "name": "mip",
        "sessionId": "123456"
    }
}
```

处理异常：
```json
{
    "status": 500
}
```

<a href="#logout" id="logout" name="logout"></a>
### 退出

#### 接口地址

<https://xzh.mip.xuexb.com/api/userinfo.json>

#### 请求类型

POST

#### 请求参数
参数名 | 说明
--- | ---
`type` | `logout` - 固定参数

#### 返回值

```json
{
    "status": 0,
    "url": "https://admin.static.xuexb.com/html/xuexb/detail.html"
}
```


## Nginx 配置

<https://github.com/xuexb/nginx-conf/blob/master/conf/xuexb/xzh.mip.xuexb.com.conf>

## License

MIT
