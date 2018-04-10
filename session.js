/**
 * @file 服务端运行环境
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const Store = require('./store.js');

module.exports = (opts = {}) => {
    const {key = 'koa:mip-app', store = new Store()} = opts;

    return async (ctx, next) => {
        let id = ctx.cookies.get(key, opts);

        // 注入 GET.accessToken
        if (!id && ctx.query.accessToken) {
            id = ctx.query.accessToken;
        }
        // 注入 POST.accessToken ，依赖 koa-bodyparser
        else if (!id && ctx.request && ctx.request.body && ctx.request.body.accessToken) {
            id = ctx.request.body.accessToken;
        }

        if (!id) {
            id = store.getID(24);
            ctx.session = {};
        }
        else {
            ctx.session = await store.get(id, ctx);
            // check session must be a no-null object
            if (typeof ctx.session !== 'object' || ctx.session == null) {
                ctx.session = {};
            }
        }

        // 注入变量
        ctx.accessToken = id;

        const old = JSON.stringify(ctx.session);

        await next();

        // if not changed
        if (old == JSON.stringify(ctx.session)) {
            return;
        }

        // if is an empty object
        if (ctx.session instanceof Object && !Object.keys(ctx.session).length) {
            ctx.session = null;
        }

        // need clear old session
        if (id && !ctx.session) {
            await store.destroy(id, ctx);
            return;
        }

        // set/update session
        const sid = await store.set(ctx.session, Object.assign({}, opts, {
            sid: id
        }), ctx);
        ctx.cookies.set(key, sid, opts);
    };
};
