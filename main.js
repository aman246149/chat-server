const express = require('express');
const userRoute = require('./router/user');
const mongoose = require('mongoose');
require('dotenv').config();
const protected = require('./middleware/protected_route');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const chatController = require('./controller/chat');
const chatRoute = require('./router/chat');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/chat';

const connectionParams = {
    useNewUrlParser: true,
}

const corsOptions = {
    origin: '*', // Allow only this origin to access
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.use('/user', protected, userRoute);
app.use('/chat', protected, chatRoute);

chatController(io);


//send helow world
app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));


module.exports = { app, server, io };