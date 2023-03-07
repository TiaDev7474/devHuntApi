const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const postRoutes = require('./routes/post')

//connexion à mongoDB

mongoose.connect('mongodb+srv://Riry7474:Riry7474@cluster0.xgtpkdx.mongodb.net/?retryWrites=true&w=majority',

        {
          useNewUrlParser: true,
          useUnifiedTopology: true })
        .then(()=> console.log('connexion à MongoDB reussie'))
        .catch(() => console.log('Connexion à MongoDB echoué'));

const app = express()

//middleware

app.use(express.json())


//routes

app.use('/api/post', auth, postRoutes)




app.listen(process.env.PORT||3000, () =>{
    console.log('app listening on port 3000')
})

