/**
 * @file 服务端运行环境
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {randomBytes} = require('crypto');

class Store {
    constructor() {
        this.sessions = new Map();
    }

    getID(length) {
        return randomBytes(length).toString('hex');
    }

    get(sid) {
        if (!this.sessions.has(sid)) {
            return undefined;
        }

        // We are decoding data coming from our Store, so, we assume it was sanitized before storing
        return JSON.parse(this.sessions.get(sid));
    }

    set(session, {sid = this.getID(24)} = {}) {
        try {
            this.sessions.set(sid, JSON.stringify(session));
        }
        catch (err) {
            console.log('Set session error:', err);
        }

        return sid;
    }

    destroy(sid) {
        this.sessions.delete(sid);
    }
}

module.exports = Store;
