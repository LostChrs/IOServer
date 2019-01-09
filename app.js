const _ = require("lodash");
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/public'));
console.log("start server...");

const getUid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const getRoomId = () => {
    const id = getUid();
    return id.substr(0,6);
}

const roomInfo = {};

//可用的房间
const getRoom = () => {
    for (let key in roomInfo) {
        if (roomInfo[key].length < 2) return key;
    }

    console.log("新建房间");
    const roomId = getRoomId();
    roomInfo[roomId] = [];
    return roomId;
}
//socket部分
io.on('connection', (socket) => {
    let roomId = "";
    let user = {};
    socket.on('createRoom', (data) => {
        //有房间直接进入，否则创建房间
        console.log(data);
        
        if(roomId != ""){
            socket.emit('disconnect');
        }
        user = data;
        roomId = getRoom();
        roomInfo[roomId].push(user);

        console.log("房间:" + roomId + "==>" + JSON.stringify(roomInfo[roomId]));
        socket.emit('createRoomSuccess', roomInfo[roomId]);

        socket.join(roomId);
        // setTimeout(()=>{
        //     socket.emit("enterRoom","进入房间");
        // },3000);
    })

    // 接收用户消息,发送相应的房间
    socket.on('message', (msg)=> {
        // 验证如果用户不在房间内则不给发送
        if (roomInfo[roomId].indexOf(user) === -1) {
            console.log("用戶不在房間");
            return false;
        }
        //console.log("發送消息==>"+msg);
        io.to(roomId).emit('msg', {fromPlayer:user,msg:msg});
    });


    socket.on('leave', ()=> {
        socket.emit('disconnect');
    });

    //断开事件
    socket.on('disconnect', (data) => {
        if(roomId == '')return;
        var index = roomInfo[roomId].indexOf(user);
        if (index !== -1) {
            roomInfo[roomId].splice(index, 1);
        }

        socket.leave(roomId);    // 退出房间
        io.to(roomId).emit('sys', user.name + '退出了房间', roomInfo[roomId]);
        console.log(user.name + '退出了' + roomId);
        roomId = "";
    })

});




server.listen(3000);