
import io from 'socket.io-client'
import { socketURL } from './AppData';
export const socket = io(socketURL, {
    autoConnect: false
});


