const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
     //     console.log(req.headers.authorization.split(' ')[1])
         const token = req.headers.authorization.split(' ')[1];
        
         const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
         const userId = decodedToken.userId;
     //     console.log(decodedToken)
         req.auth ={
            userId: userId
         }
         next();

    }
    catch(err){
         res.status(401).json({err})
    }
}