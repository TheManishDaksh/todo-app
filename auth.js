
const jwt = require("jsonwebtoken")
const SCRT_KEY = "manish9548@gmail"


function auth(req,res,next){
    
    const token = req.headers.token;

    const decoded = jwt.verify(token,SCRT_KEY)
    if(decoded){
        req.userid = decoded.id;
        next()
    }else{
        res.status(403).json({
            message : "invalid token"
        })
    }
}
module.exports = {
    auth,
    SCRT_KEY
}