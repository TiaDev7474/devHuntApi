const { json } = require('express')
const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) =>{
    try{
        const token = req.header.authorization.split('')[1]
        const decodedToken = jwt.verify(token, 'My secret key to decode token ')

        const userid = decodedToken.userid
        req.auth={
            userid:userid
        }
        next()
    }
    catch{
        res.status(403).json({message:"access not authorized!!!"})
    }
 
}