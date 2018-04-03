/**
 * @file 服务端运行环境
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const Koa = require('koa');
const session = require('koa-session2');
const Router = require('koa-router');
const Api = new Router();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const request = require('request-promise');

if (!process.env.MIP_XZH_CLIENT_ID) {
    console.error('请配置环境变量：MIP_XZH_CLIENT_ID');
    process.exit(1);
}

if (!process.env.MIP_XZH_SECRET) {
    console.error('请配置环境变量：MIP_XZH_SECRET');
    process.exit(1);
}

// 使用ctx.body解析中间件
const app = new Koa();

// 注入 POST 数据
app.use(bodyParser());

// 注入 session
app.use(session({
    expires: new Date('2020-01-01')
}));

// 注入 JSONP 方法
app.use(async (ctx, next) => {
    ctx.json = data => {
        ctx.body = JSON.stringify(data);
    };

    ctx.jsonp = data => {
        if (ctx.query.callback) {
            const cb = ctx.query.callback;
            const body = JSON.stringify(data);

            ctx.set('Content-Type', 'text/javascript; charset=utf-8');
            ctx.body = `typeof ${cb} === 'function' && ${cb}(${body})`;
        }
        else {
            ctx.json(data);
        }
    };

    await next();
});

// 注入异步接口添加跨域和不缓存
app.use(async (ctx, next) => {
    ctx.set('Content-Type', 'application/json; charset=utf-8');
    ctx.set('Cache-Control', 'no-cache,no-store');

    // 非 JSONP 配置 CORS
    if (!ctx.query.callback) {
        ctx.set('Access-Control-Allow-Credentials', true);
        ctx.set('Access-Control-Allow-Origin', ctx.header.origin || '*');
    }

    await next();
});

// 用户信息
Api.post('/api/userinfo.json', async ctx => {
    const query = ctx.request.body;
    // 检查用户是否登录
    if (query.type === 'check') {
        const userinfo = ctx.session.userinfo;

        if (!userinfo) {
            return ctx.jsonp({
                status: 1
            });
        }
        return ctx.jsonp({
            status: 0,
            data: userinfo
        });
    }

    // 登录授权
    if (query.type === 'login') {
        if (ctx.session.userinfo) {
            return ctx.jsonp({
                status: 0,
                data: ctx.session.userinfo
            });
        }

        try {
            const source = await request({
                uri: `https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=${query.code}&client_id=${process.env.MIP_XZH_CLIENT_ID}&client_secret=${process.env.MIP_XZH_SECRET}&redirect_uri=${encodeURIComponent(query.redirect_uri)}`,
                json: true,
                headers: {
                    'Cache-Control': 'no-cache'
                },
                timeout: 1000 * 5
            });

            const data = await request({
                uri: `https://openapi.baidu.com/rest/2.0/cambrian/sns/userinfo?access_token=${source.access_token}&openid=${source.openid}`,
                json: true,
                headers: {
                    'Cache-Control': 'no-cache'
                },
                timeout: 1000 * 5
            });

            // 拼成友好的格式
            const userinfo = {
                name: data.nickname,
                avatar: data.headimgurl,
                sex: data.sex
            };

            // 记录状态
            ctx.session.userinfo = userinfo;

            return ctx.jsonp({
                status: 0,
                data: userinfo
            });
        }
        catch (err) {
            console.error(err.error);
            return ctx.jsonp({
                status: 1,
                data: {
                    msg: '登录失败',
                    statusCode: err.statusCode || 500
                }
            });
        }
    }

    if (query.type === 'logout') {
        ctx.session.userinfo = null;
        return ctx.jsonp({
            status: 0
        });
    }

    return ctx.jsonp({
        status: 404
    });
});

// 静态代理
app.use(serve(__dirname));

// 路由
app.use(Api.routes());
app.use(Api.allowedMethods());

// 404
app.use(async ctx => {
    ctx.jsonp({
        status: 404
    });
});

app.listen(3001);
