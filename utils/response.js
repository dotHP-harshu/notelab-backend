const sendSuccess = (res, status, succes= true, message, data={})=>{
    res.status(status).json({
        succes,message, data,status
    })
}
const sendError = (res, status, succes=false, message, error={})=>{
    res.status(status).json({
        succes, message, error,status
    })
}

module.exports = {sendSuccess, sendError}