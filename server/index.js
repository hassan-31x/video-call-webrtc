const { Server } = require("socket.io")

const io = new Server(8080)

io.on("connection", (socket) => {
  console.log("New client connected", socket.id)
})