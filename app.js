const _ = require("lodash");
const Helper = require("./helpers/Helper");
const game = require("./game/game");
const { setupServer } = require("./game/server");
console.log("start server...");

//socket部分
const ws = require('nodejs-websocket')

const server = ws.createServer(connection => {
    connection.on('text', function (json) {
        console.log('收到消息', json);
        const msg = JSON.parse(json);
        const { msgId, data } = msg;
        if (msgId == 'enterRoom') {
            connection.playerId = data.playerId;
            game.enterRoom(data);
        } else if (msgId == 'moveTo') {
            game.moveTo(data);
        } else if (msgId == 'takeItem') {
            game.takeItem(data);
        }
    })
    connection.on('close', function (code, reason) {
        console.log('关闭连接', code, reason)
        game.leaveRoom(connection.playerId);
    })
    connection.on('error', function (code) {
        try {
            connection.close()
        } catch (error) {
            console.log('close异常', error)
        }
        console.log('异常关闭', code)
    })
})

server.listen(3000);
setupServer(server);
