const { Server } = require("socket.io")

const PORT = 8080

const io = new Server(PORT, {
  // cors: {
  //   origin: ["http://localhost:5173", "http://192.168.100.46:5173"],
  //   methods: ["GET", "POST"]
  // }
  cors: true
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

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer })
  })
  
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans })
  })
  
  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer })
  })
  
  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans })
  })
})