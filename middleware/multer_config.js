const multer = require('multer')
const fs= require('fs')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'video/mp4':'mp4',
    'audio/mp3':'mp3'
}
 const storage= multer.diskStorage({
      destination:(req , file , cb)=>{
           cb(null, './Uploads')
      },
      filename:(req, file , cb) =>{
           const name = file.originalname.split('').join('_')
           const fileExtension= MIME_TYPES[file.mimetype]
           cb(null, name + Date.now()+'.'+fileExtension);
           req.on('aborted', () => {
               const fullFilePath = path.join('/Uploads', name);
               file.stream.on('end', () => {
                 fs.unlink(fullFilePath, (err) => {
                   console.log(fullFilePath);
                   if (err) {
                     throw err;
                   }
                 });
               });
               file.stream.emit('end');
      })
           
 }})
 const postFileFilter = (req, file, cb)=>{
    if(file.mimetype == "video/mp4"|| file.mimetype =="audio/mp3" ||file.mimetype =="image/jpg" ||file.mimetype =="image/jpeg"||file.mimetype == "image/png"
    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
 }
 module.exports = multer({storage:storage, fileFilter:postFileFilter})