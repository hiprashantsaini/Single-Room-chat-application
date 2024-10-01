const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const chat = require('./chatModels/chatMessages');
const user = require('./chatModels/userModel');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const auth = require('./auth');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',  // Specify the frontend origin explicitly
    methods: ['GET', 'POST'],         // Allowed methods
    credentials: true                 // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Sending all messages
app.get('/api/allchats', async (req, res) => {
    try {
        const messages = await chat.find({}).populate({
            path: 'author',
            select: 'username email'
        });
        console.log("works")
        res.status(200).send({ success: true, messages });
    } catch (error) {
        console.log("Get all Messages :", error.message);
        res.status(500)({ success: false, message: "There is some error. Please try again" });
    }
})


app.post('/user/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ success: false, message: "Something is missing. Please check!." })
        }
        const User = await user.findOne({ email })
        if (!User || User.password !== password) {
           return res.status(401).send({ success: false, message: "Invalid email or password." })
        }
        const token = jwt.sign({ userId: User._id }, 'my_secret_key_this', { expiresIn: '1d' });
        const userData = {
            username: User.username,
            email: User.email
        }
        console.log("token :", token);
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 })
            .json({ success: true, message: "You are loggedIn successfully.", user: userData });
    } catch (error) {
        console.log("Login user :", error.message);
        res.status(500).send({ success: false, message: "There is some error. Please try again" });
    }
});

app.post('/user/api/signup', async (req, res) => {
    console.log(req.body)
    try {
        const { username, email, password } = req.body;
        const User = await user.create({
            username,
            email,
            password
        })
        res.status(201).send({ success: true, message: "You are registered successfully.", user: User });
    } catch (error) {
        console.log("Login user :", error.message);
        res.status(500).send({ success: false, message: "There is some error. Please try again" });
    }
});

//get loggedIn user
app.get('/api/user', auth, async (req, res) => {
    try {
        const userId = req.userId;
        const User = await user.findById({ _id: userId }, { password: 0 });
        console.log("userId ", userId)
        res.status(200).send({ success: true, user: User });
    } catch (error) {
        console.log("Login user :", error.message);
        res.status(500).send({ success: false });
    }
})


const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

const allLiveUsers = {};

io.on('connection', async(socket) => {
    console.log("The client connected :", socket.id);
    const userId = socket.handshake.query?.userId;

    if (!userId) return;
    let userData=await user.findById(userId);

    allLiveUsers[userId] = userData;

    socket.on('newMessage', async (msg) => {
        console.log("UserId", userId)
        try {
            const User = await user.findById({ _id: userId });
            if (User) {
                const data = await chat.create({
                    author: User._id,
                    msg
                });

                const chatData = await chat.findById(data?._id).populate('author', 'username email');
                console.log("data :", chatData)
                io.emit('oneNewMessage', chatData);
            }
        } catch (error) {
            console.log("Error while adding new message :", error);
        }

    })

    socket.on('disconnect', () => {
        console.log("disconnected :",allLiveUsers[userId]);
        delete allLiveUsers[userId];
    })
})

app.get('/api/allLive', async (req, res) => {
    try {
        const values = Object.values(allLiveUsers);
        console.log("all Live :",allLiveUsers)
        console.log("all Live :",values)
        res.status(200).json({ success: true, values });
    } catch (error) {
        console.log("allLive users :", error.message);
        res.status(500).send({ success: false });
    }
})



mongoose.connect("mongodb://127.0.0.1:27017/singleChatRoom")
    .then(() => {
        console.log("Database connected")
        server.listen(8000, () => {
            console.log("Server is running at port ", 8000);
        })
    });




