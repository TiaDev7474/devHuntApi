const multer = require('multer')

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
           cb(null, name + Date.now()+'.'+fileExtension)
      }
 })
//  const postFileFilter = (req, res, cb)=>{
//     if(
//         file.mimetype == "video/mp4" ||
//         file.mimetype =="audio/mp3" ||
//         file.mimetype =="image/jpg"  ||
//         file.mimetype =='image/jpeg'||
//         file.mimetype == 'image/png'
//     ){
//         cb(null, true)
//     }else{
//         cb(null, false)
//     }
//  }
 module.exports = multer({storage:storage})