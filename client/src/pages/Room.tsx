import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/SocketProvider"
import ReactPlayer from "react-player"

type StreamType = string | MediaStream

const RoomPage = () => {
  const [socketId, setSocketId] = useState('')
  const [stream, setStream] = useState<StreamType>('')

  const socket = useSocket()


  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    setStream(stream)
  }, [])

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    setSocketId(id)
    handleCall()
  }, [])

  useEffect(() => {
    socket?.on("user:joined", handleUserJoined)

    return () => {
      socket?.off("user:joined", handleUserJoined)
    }
}, [socket, , socketId])


  return (
    <div className="w-full h-full flex flex-col items-center">
      <h2 className="text-3xl font-semibold py-4">Room</h2>
      {socketId && stream ? <div>
        <h3 className="text-xl">ID: {socketId}</h3>
        <ReactPlayer playing muted width='300px' height='200px' url={stream} />
      </div> : <h3>Waiting for users to join...</h3>}
    </div>
  )
}

export default RoomPage