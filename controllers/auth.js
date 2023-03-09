const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.login = (req, res) => {
    User.findOne({email : req.body.email})
    .then( user =>{
         if( !user){
            return res.status(401).json({ message : 'Paire identifiant/ mot de passe incorrecte'})
         }else{
            bcrypt.compare( req.body.password, user.password)
            .then( valid =>{
                if(!valid){
                    return res.status(401).json({ message : 'Paire identifiant/ mot de passe incorrecte'})
                }
                res.status(200).json({
                    userId: user._id,
                    isAdmin:user.isAdmin,
                    token: jwt.sign(
                        {userId : user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn : '24h'}
                  
                    )
                })
            })
            .catch(error => res.status(500).json({error}))
         }
    })
    .catch( error => res.status(500).json({error}));
}

exports.signUp = (req , res , next)=>{
    const {fname , lname, password, email} = req.body
    User.findOne({email:email})
        .then(user =>{
             if(!user){
                // const salt = bcrypt.genSalt(10)
                bcrypt.hash(password, 10)
                      .then( hash =>{

                        const user = new User({
                            ...req.body,
                            password: hash
                        })
                        user.save()
                            .then(user=> res.status(201).json(user))
                            .catch(err => res.status(500).json({message:err}))

                      })
                      .catch( err => res.status(500).json({message:err}))
               
               
             }else{
                res.status(404).json({message:"already have have an account with this email"})
             }
        })
        .catch(err => res.status(500).json({message:err}))
}