const { sendError } = require("../utils/response")
const jwt = require("jsonwebtoken")

sendError

function authMiddleware (req, res, next){
    const {token} = req.cookies

    if(!token) return sendError(res, 401, false, "Unathorised activity.", {message:"Unauthorised access" , code:401});

    try{
        const match = jwt.verify(token, process.env.JWT_SECRET);
        if(!match) return sendError(res, 401, false, "Unathorised activity.", {
          message: "Unauthorised access",
          code: 401,
        });

        req.userId = match.id;
        next()
        
        

    }catch(error){
        sendError(res, 401, false, "Unathorised activity.", {
          message: "Unauthorised access",
          code: 401,
        });
    }

    
}

module.exports = authMiddleware