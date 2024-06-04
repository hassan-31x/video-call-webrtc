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
    console.log('rooom join')
    emailToSocketId.set(email, socket.id)
    socketIdToEmail.set(socket.id, email)

    io.to(room).emit("user:joined", { email, id: socket.id, member: !io.sockets.adapter.rooms.get(room) ? 0 : 1, })
    socket.join(room)
    // console.log("🚀 ~ io.on ~ room:", io.sockets.adapter.rooms.get('123').size)

    io.to(socket.id).emit("room:join", data)
  })

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer })
    console.log('user call')
  })
  
  socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans })
      console.log('call accepted')
  })
  
  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer })
    console.log('nego needed')
  })
  
  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans })
    console.log('nego done')
  })
  
  socket.on("send:stream", ({ to }) => {
    // io.to(to).emit("peer:nego:final", { from: socket.id, ans })
    console.log('neg ', to)
  })
})