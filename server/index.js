const { Server } = require("socket.io")

const PORT = 8080

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("New client connected", socket.id)
})