const express = require('express'); 
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/public')); 
console.log("start server...");
server.listen(3000);

//socket部分
io.on('connection', (socket)=> {
    //接收并处理客户端的hi事件
    socket.on('createRoom', (data)=> {
        console.log(data);

        //触发客户端事件c_hi
        socket.emit('createRoomSuccess','创建房间成功!')

        setTimeout(()=>{
            socket.emit("enterRoom","进入房间");
        },3000);
    })

    //断开事件
    socket.on('disconnect', (data)=> {
        console.log('断开',data)
        socket.emit('c_leave','离开');
        //socket.broadcast用于向整个网络广播(除自己之外)
        //socket.broadcast.emit('c_leave','某某人离开了')
    })

});