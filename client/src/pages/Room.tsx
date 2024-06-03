import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/SocketProvider"
import ReactPlayer from "react-player"
import peer from "../service/peer"

type StreamType = MediaStream | null

const RoomPage = () => {
  const [socketId, setSocketId] = useState('')
  const [stream, setStream] = useState<StreamType>(null)
  const [remoteStream, setRemoteStream] = useState<StreamType>(null)
  console.log("🚀 ~ RoomPage ~ remoteStream:", remoteStream)

  const socket = useSocket()


  const handleCall = useCallback(async (id: string) => {
    // const stream = await MediaDevices.getUserMedia({
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    const offer = await peer.getOffer()
    socket?.emit("user:call", { to: id, offer })

    setStream(stream)
    console.log('s=s ', stream)
  }, [socket, socketId])

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    setSocketId(id)
    handleCall(id)
  }, [])

  const handleIncomingCall = useCallback(async ({ from, offer }: { from: string; offer: { type: string; sdp: string } }) => {
    setSocketId(from)
    const stream = await navigator.mediaDevices.getUserMedia({
    // const stream = await MediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    setStream(stream)
    // console.log('s=s ', stream)

    const ans = await peer.getAnswer(offer)
    socket?.emit("call:accepted", { to: from, ans })
  }, [])

  const sendStreams = useCallback(() => {
    console.log('s', stream)
    if (stream) {
      for (const track of stream.getTracks()) {
        console.log("🚀 ~ sendStreams ~ track:", track)
        peer.peer.addTrack(track, stream);
      }
    } else console.log('s null')
  }, [stream]);

  useEffect(() => {
    // if (stream) {
    //   sendStreams();
    // }
    console.log('stream changed', stream)
  }, [stream, sendStreams]);

  const handleCallAccepted = useCallback(async ({ from, ans }: { from: string; ans: any }) => {
    peer.setLocalDescription(ans)
    console.log('hhh => ', stream)

      sendStreams()
  }, [sendStreams])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer()
      socket?.emit("peer:nego:needed", { offer, to: socketId })
  }, [socket, socketId])

  const handleNegoIncoming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer)
    socket.emit("peer:nego:done", { to: from, ans })
  }, [socket])

  const handleNegotiationDone = useCallback(async ({ ans }) => {
    peer.setLocalDescription(ans)
  }, [])


  useEffect(() => {
    peer.peer.addEventListener('track', async (ev) => {
      const remoteS = ev.streams
      console.log("🚀 ~ useEffect ~ remoteS:", remoteS)
      setRemoteStream(remoteS[0])
    })
  }, [])

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])


  useEffect(() => {
    socket?.on("user:joined", handleUserJoined)
    socket?.on("incomming:call", handleIncomingCall)
    socket?.on("call:accepted", handleCallAccepted)
    socket?.on("peer:nego:needed", handleNegoIncoming)
    socket?.on("peer:nego:final", handleNegotiationDone)

    return () => {
      socket?.off("user:joined", handleUserJoined)
      socket?.off("incomming:call", handleIncomingCall)
      socket?.off("call:accepted", handleCallAccepted)
      socket?.off("peer:nego:needed", handleNegoIncoming)
      socket?.off("peer:nego:final", handleNegotiationDone)
    }
}, [socket, handleUserJoined, handleIncomingCall, handleIncomingCall, handleNegoIncoming, handleNegotiationDone])


  return (
    <div className="w-full h-full flex flex-col items-center">
      <h2 className="text-3xl font-semibold py-4">Room</h2>
      {socketId && stream ? <div>
        <h3 className="text-xl">ID: {socketId}</h3>
        <ReactPlayer playing muted width='300px' height='200px' url={stream} />
      </div> : <h3>Waiting for users to join...</h3>}
      {remoteStream && <div className="w-4 h-4 border">
        <ReactPlayer playing muted width='300px' height='200px' url={remoteStream} />
      </div>}
    </div>
  )
}

export default RoomPage