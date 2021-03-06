const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 3001;
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));
    app.get("/", (req, res) => {
        req.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
}

const rooms = new Map();

// app.get('/room:id', (req, res) => {
//     const roomId = req.params.id.slice(1);
//     const usersNames = [...rooms.get(roomId).get('users').values()]
//     const messages = [...rooms.get(roomId).get('messages').values()]

//     console.log('get юзеров');
//     console.log(usersNames);

//     res.send({usersNames, messages});
// })

app.post("/room", (req, res) => {
    const { roomId } = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ["users", new Map()],
                ["messages", []],
            ])
        );
    }

    res.send();
});

io.on("connection", (socket) => {
    socket.on("ROOM:JOIN", async ({ roomId, username }) => {
        socket.join(roomId);
        rooms.get(roomId).get("users").set(socket.id, username);

        const users = [...rooms.get(roomId).get("users").values()];
        const messages = [...rooms.get(roomId).get("messages")];

        socket.to(roomId).emit("ROOM:SET_USERS", users);
        socket.emit("ROOM:SET_DATA", { users, messages });
    });

    socket.on("ROOM:MESSAGE", ({ roomId, username, message }) => {
        const obj = { username, message };
        rooms.get(roomId).get("messages").push(obj);
        socket.to(roomId).emit("ROOM:MESSAGE", obj);
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            if (value.get("users").delete(socket.id)) {
                const usersMap = rooms.get(roomId).get("users");
                const usersNames = [...usersMap.values()];
                socket.to(roomId).emit("ROOM:SET_USERS", usersNames);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log("listening on 3001");
});
