const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { Socket } = require("dgram");

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.get("/", (req, res) => {
    res.send("Welcome to server page");
});

const server = http.createServer(app);
const io = socketIo(server);

const users = {};
const rooms = {};
const admin = {};
const points = {};

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        const roomNumber = data.roomNumber;
        const isAdmin = data.isAdmin;

        // Check if there is already an admin in the room
        const existingAdmin = Object.keys(admin).some(key => admin[key] && rooms[key] === roomNumber);

        if (isAdmin && existingAdmin) {
            // Notify the user that an admin is already present in the room
            io.to(rooms[socket.id]).emit("admin_exists", { error: "An admin is already present in this room." });
            return;
        }

        users[socket.id] = data.username;
        rooms[socket.id] = roomNumber;
        admin[socket.id] = isAdmin;
        points[socket.id] = 0;
        socket.join(roomNumber);

        // Send updated userInfo to the room
        const userInfo = Object.keys(users).map((key) => {
            return { name: users[key], point: points[key], room: rooms[key], isAdmin: admin[key]};
        }).filter(user => user.room === roomNumber);
        io.to(roomNumber).emit('connected-user', { userInfo, room: roomNumber });
        console.log(users[socket.id], "Connected to room", roomNumber);
    });


    socket.on("send_message", (data) => {
        socket.to(rooms[socket.id]).emit("received_message", data);
    });

    socket.on("question", (data) => {
        console.log("question : ", data);
        io.to(rooms[socket.id]).emit("received_question", data);
    });

    socket.on("game-started", (data) => {
        console.log("game Started : ", data);
        const userInfo = Object.keys(users).map((key) => {
            return { name: users[key], point: points[key], room: rooms[key], isAdmin: admin[key] };
        }).filter(user => user.room === rooms[socket.id]);
        
        io.to(rooms[socket.id]).emit("received_question", data);
        io.to(rooms[socket.id]).emit('connected-user', { userInfo, room: rooms[socket.id] });
    });

    socket.on('update-point', (data) => {
        points[socket.id] += data.increase;
        const userInfo = Object.keys(users).map((key) => {
            return { name: users[key], point: points[key], room: rooms[key], isAdmin: admin[key] };
        }).filter(user => user.room === rooms[socket.id]);
        io.to(rooms[socket.id]).emit('connected-user', { userInfo, room: rooms[socket.id]});
    });

    socket.on("disconnect", () => {
        const roomNumber = rooms[socket.id];
        console.log("User left:", users[socket.id]);
        delete users[socket.id];
        delete rooms[socket.id];
        delete admin[socket.id];
        delete points[socket.id];

        // Send updated userInfo to the room
        const userInfo = Object.keys(users).map((key) => {
            return { name: users[key], point: points[key], room: rooms[key], isAdmin: admin[key] };
        }).filter(user => user.room === roomNumber);
        io.to(roomNumber).emit('connected-user', { userInfo, room: roomNumber });
    });

    socket.on("game-ended", () => {
        const roomNumber = rooms[socket.id];
        const userPoints = Object.keys(points).map(key => ({
            name: users[key],
            point: points[key],
            room: rooms[key]
        })).filter(user => user.room === roomNumber);

        const topper = userPoints.reduce((max, user) => user.point > max.point ? user : max, userPoints[0]);

        io.to(roomNumber).emit('game-topper', { topper });
    });
});

server.listen(PORT, () => {
    console.log("APP IS RUNNING at", PORT);
});
