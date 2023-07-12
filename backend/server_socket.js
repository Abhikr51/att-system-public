const express = require('express');
const { Server } = require("socket.io");
const app = express();
const http = require('http');
const Qrcode = require('./models/Qrcode');
const AttendanceController = require('./controllers/AttendanceController');
const Attendance = require('./models/Attendance');
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
      origin: "*"
    }
  });



server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Socket listening on:${process.env.SOCKET_PORT}`);
});

io.on('connection', (socket) => {
    // console.log('a user connected',socket.id);
    socket.on('client:sendQrId',async({qr_id , a_id})=>{
        const a_list = await Attendance.findById(a_id).populate('users').lean()
        const qrcode = await Qrcode.findById(qr_id).lean()
        socket.emit('getQrText',{qr_text : qrcode.qr_code , a_list :a_list.users})
    })
    socket.on('app:makeAttendance',async(client_data)=>{
        AttendanceController.make_attendance(client_data,socket)
    })
    // setInterval(()=>{
    //     socket.emit('getQrText',Date.now())
    // },2000)
    socket.on("disconnect", (reason) => {
        console.log('Disconnected user',socket.id);
    });
});


