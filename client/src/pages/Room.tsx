import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/SocketProvider"
import ReactPlayer from "react-player"
import peer from "../service/peer"

type StreamType = string | MediaStream

const RoomPage = () => {
  const [socketId, setSocketId] = useState('')
  const [stream, setStream] = useState<StreamType>('')

  const socket = useSocket()


  const handleCall = useCallback(async (id: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    const offer = await peer.getOffer()
    socket?.emit("user:call", { to: id, offer })

    setStream(stream)
  }, [socket, socketId])

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    setSocketId(id)
    handleCall(id)
  }, [])

  const handleIncomingCall = useCallback(async ({ from, offer }: { from: string; offer: { type: string; sdp: string } }) => {
    console.log('niga')
    setSocketId(from)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    setStream(stream)

    const ans = await peer.getAnswer(offer)
    socket?.emit("call:accepted", { to: from, ans })
  }, [])

  const handleCallAccepted = useCallback(async ({ from, ans }: { from: string; ans: any }) => {
    peer.setLocalDescription(ans)
  }, [])


  useEffect(() => {
    socket?.on("user:joined", handleUserJoined)
    socket?.on("incomming:call", handleIncomingCall)
    socket?.on("call:accepted", handleCallAccepted)

    return () => {
      socket?.off("user:joined", handleUserJoined)
      socket?.off("incomming:call", handleIncomingCall)
      socket?.off("call:accepted", handleIncomingCall)
    }
}, [socket, handleUserJoined, handleIncomingCall, handleIncomingCall])


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