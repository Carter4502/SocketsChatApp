const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, { cors: {origin:'*'}})


io.on("connection", socket => {
    socket.on("message", ({name, message, color}) => {
        io.emit("message", {name, message, color})
    })
})

http.listen(4000, function() {
    console.log('listening on port 4000.')
})


