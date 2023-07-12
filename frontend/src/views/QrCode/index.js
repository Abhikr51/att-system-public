import React, { useEffect, useState } from 'react'
import QRCodeGenerator from "react-qr-code";
import { useParams } from 'react-router-dom';
import { socket } from '../../config/socket';
const QrCode = () => {
    const { qr_data } = useParams()
    let data = qr_data.split('$')
    const [code, setCode] = useState(data[0])
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [attendanceList, setAttendanceList] = useState([])
    let timeout;
    function onConnect() {
        socket.connect();
        setIsConnected(true);
    }

    function onDisconnect() {
        socket.disconnect();
        setIsConnected(false);
    }
    const showRecorded = (text) => {
        let elm = document.getElementById('recorded')
        elm.classList.remove('d-none');
        elm.innerHTML = text;
        return setTimeout(() => {
            elm.classList.add('d-none');
            elm.innerHTML = "";
        }, 4000)
    }
    const communicate_with_socket = () => {
        onConnect()
        socket.emit('client:sendQrId', { qr_id: data[1], a_id: data[2] })
        socket.on('getQrText', ({ qr_text, a_list }) => {
            console.log(a_list);
            setCode(qr_text)
            setAttendanceList(a_list)
        })
        socket.on('client:sendScannedSuccess', (user) => {
            console.log(user);
            timeout = showRecorded("Attendance recorded : " + user.name)
        })
    }
    useEffect(() => {
        // console.log(params);
        // var timeout = setInterval(()=>{
        //     let temp = Date.now()
        //     console.log(temp);
        //     setCode(temp + "test")
        // },2000)
        // return ()=>{
        //     clearInterval(timeout);
        // }
        communicate_with_socket()
        return () => {
            onDisconnect()
            clearTimeout(timeout)
        };
    }, [])

    return (
        <div className="wrapper">
            {/* <div className="container-fluid"> */}
                <div className="row h-100">
                    <div className="col-md-8">
                        <div className='d-flex h-100 justify-content-center align-items-center flex-column' >
                            <h3 style={{ padding: "10px 30px", borderRadius: 50 }} className={`bg-${isConnected ? 'primary' : 'danger'} text-white `} >{isConnected ? 'Connected' : "Disconnected"}</h3>
                            <div style={{ background: 'white', padding: '16px', border: "3px dashed black" }}>
                                <QRCodeGenerator size={512} value={`${code}$${data[1]}$${data[2]}`} />
                            </div>
                            <p id='recorded' className={`btn btn-warning w-50 m-4 text-white d-none`} ></p>
                        </div>
                    </div>
                    <div className="col-md-4 py-4">
                        <ul>
                            {attendanceList.map((item, index) => (
                                <li key={index} >{item.first_name + " " + item.last_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            {/* </div> */}

        </div>
    )
}

export default QrCode