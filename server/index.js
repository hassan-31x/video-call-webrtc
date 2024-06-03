const { Server } = require("socket.io")

const PORT = 8080

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const emailToSocketId = new Map()
const socketIdToEmail = new Map()

io.on("connection", (socket) => {
  console.log("New client connected", socket.id)

  socket.on("room:join", data => {
    const { room, email } = data

    emailToSocketId.set(email, socket.id)
    socketIdToEmail.set(socket.id, email)

    io.to(room).emit("user:joined", { email, id: socket.id })
    socket.join(room)

    io.to(socket.id).emit("room:join", data)
  })
})