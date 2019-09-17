/**
 * 服务器消息收发辅助类
 */

 let server = null;
 const broadcast = (msgId,info={}) => {
    const data = {
        msgId:msgId,
        data:info,
    }
    console.log('broadcast',msgId, info)
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(data))
    })
}

const setupServer = (s)=>{
    server = s;
    console.log("Setup Server...");
}

module.exports = {
    broadcast,
    setupServer,
}