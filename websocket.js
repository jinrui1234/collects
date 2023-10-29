/**
 * websocket类
 */
class Websocket {
    constructor(url, options) {
        this.heartBeatTimer = null;
        this.options = options;
        this.messageMap = {};
        this.connState = 0;
        this.socket = null;
        this.url = url;
        this.reconnectTimer = null;
        // 关闭socket是否进行心跳检测，默认不检测
        this.isHeartBeat = options ? (options.type ? options.type : false) : false;
    }
    /**
     * 打开websocket监听
     * @returns
     */
    doOpen(msg = null) {
        if (this.connState) {
            return;
        }
        this.connState = 1;
        this.afterOpenEmit = [];
        const BrowserWebSocket = window.WebSocket || window.MozWebSocket;
        const socket = new BrowserWebSocket(this.url);
        socket.binaryType = 'arraybuffer';
        socket.onopen = evt => this.onOpen(evt, msg);
        socket.onclose = evt => this.onClose(evt);
        socket.onmessage = evt => this.onMessage(evt);
        socket.onerror = evt => this.onError(evt);
        this.socket = socket;
    }
    /**
     * websocket打开时回调函数
     * @param {*} evt 回调事件
     */
    onOpen(evt, msg) {
        this.connState = 2;
        if (this.reconnectTimer) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.heartBeatTimer = setInterval(() => {
            this.checkHeartBeat();
        }, 6000);
        if (msg) {
            this.send(msg);
        }
        this.onReceiver({ Event: evt });
    }
    /**
     * 检查websocket是否打开
     * @returns 连接状态
     */
    checkOpen() {
        return this.connState === 2;
    }
    /**
     * websocket关闭时回调函数
     */
    onClose() {
        this.connState = 0;
        this.onReceiver({ Event: 'close' });
        clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = null;
        if (this.isHeartBeat) {
            this.reconnectTimer = setInterval(() => {
                this.doOpen();
            }, 60000);
        }
    }
    /**
     * websocket推送数据
     * @param {*} data 推送数据体
     */
    send(data) {
        if (this.connState === 2) {
            this.socket.send(data);
        } else {
            this.onReceiver({ Event: 'message', Data: { ddd: 1 } });
        }
    }
    emit(data) {
        return new Promise(resolve => {
            this.socket.send(JSON.stringify(data));
            this.on('message', data => {
                resolve(data);
            });
        });
    }
    /**
     * 消息监听事件
     * @param {*} message 消息数据
     */
    onMessage(message) {
        try {
            // const str = JSON.stringify({ data: message.data });
            // const data = JSON.parse(str);
            const data = JSON.parse(message.data);
            this.onReceiver({ Event: 'message', Data: data });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('>> Data parsing error;', err);
        }
    }
    /**
     * websocket心跳测试
     */
    checkHeartBeat() {
        const data = {
            cmd: 'ping',
            args: [Date.parse(new Date())]
        };
        this.send(JSON.stringify(data));
    }
    onError() {
        // to-do
    }
    /**
     * 接收消息体回调函数
     * @param {*} data 数据
     */
    onReceiver(data) {
        const callback = this.messageMap[data.Event];
        if (callback) {
            callback(data.Data);
        }
    }
    /**
     * 监听事件
     * @param {*} name 事件名称
     * @param {*} handler 事件回调方法
     */
    on(name, handler) {
        this.messageMap[name] = handler;
    }
    /**
     * 关闭websocket
     */
    doClose() {
        if (this.socket) {
            this.socket.close();
        }
    }
    /**
     * 销毁websocket对象
     */
    destroy() {
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer);
            this.heartBeatTimer = null;
        }
        this.doClose();
        this.messageMap = {};
        this.connState = 0;
        this.socket = null;
    }
}
export default Websocket;



//使用
// this.carListWs = new Websocket(`${window.config.websocketRoot}/std/vehicle/status`);
// this.carListWs.doOpen();
// this.carListWs.on('message', function(data) {
// console.log(data,"data");
// });

//  if (this.carListWs) {
//     this.carListWs.destroy();
//     this.carListWs = null;
// }