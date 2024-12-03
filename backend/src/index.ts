import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({port : 8080}, () => {
    console.log("Socket is connected to port 8080");
});

interface User {
    socket : WebSocket,
    room : string
}

let allSockets : User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message : string) => {
        const parsedMessage = JSON.parse(message);
        if(parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }else{
            const currUserRoom = allSockets.find((x) => x.socket == socket);
            if(currUserRoom) {
                const rooms = allSockets.filter((x) => x.room == currUserRoom.room);
                rooms.forEach((x) => {
                    x.socket.send(parsedMessage.payload.message);
                })
            }
        }
    })
})