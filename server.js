const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
    app.use(express.static('build'));
    app.get('/', (req, res) => {
        req.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    })
}

app.use(express.json());

const rooms = new Map();

app.get('/room:id', (req, res) => {
    const roomId = req.params.id.slice(1);

    const usersMap = rooms.get(roomId).get('users'); 
    const usersNames = [...usersMap.values()]
    const messages = [...rooms.get(roomId).get('messages').values()] 

    res.send({usersNames, messages});
})

app.post('/room', (req, res) => {
    const { roomId } = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([['users', new Map()], ['messages', []]]))
    }
    
    res.send();
})

io.on('connection', (socket) => {

    socket.on('ROOM:JOIN', ( {roomId, username} ) => {  
        const usersMap = rooms.get(roomId).get('users'); 
        socket.join(roomId);
        usersMap.set(socket.id, username)
        const usersNames = [...usersMap.values()]
        socket.to(roomId).emit('ROOM:SET_USERS', usersNames);
    })

    socket.on('ROOM:MESSAGE', ( {roomId, username, message} ) => {  
        const obj = { username, message }
        rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).emit('ROOM:MESSAGE', obj);
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const usersMap = rooms.get(roomId).get('users'); 
                const usersNames = [...usersMap.values()]
                socket.to(roomId).emit('ROOM:SET_USERS', usersNames);
            }
        })
    })
});

server.listen(PORT, () => {
    console.log('listening on ' + PORT);
});