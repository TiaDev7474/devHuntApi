const express = require('express');
const cors = require('cors')
const path = require('path')
const http = require('http');
const {Server}= require('socket.io');

const mongoose = require('mongoose');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

//connexion à mongoDB

mongoose.connect('mongodb+srv://Nomena:FpvWrPME6S2eFwir@cluster0.jxxdpbu.mongodb.net/?retryWrites=true&w=majority',

        {
          useNewUrlParser: true,
          useUnifiedTopology: true })
        .then(()=> console.log('connexion à MongoDB reussie'))
        .catch(() => console.log('Connexion à MongoDB echoué'));
        
//server config 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//middleware

app.use(express.json())
//cross origin config
app.use(cors({
  origin:"http://localhost:3000",
  credential:true
}))


//routes

app.use('/api/post', postRoutes)
app.use('/api/auth', authRoutes)

// app.use('/Uploads', express.static(path.join(__dirname, 'images')))




app.listen(process.env.PORT||3002, () =>{
    console.log('app listening on port 3002')
})

