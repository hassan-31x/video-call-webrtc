import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/SocketProvider"
import { useNavigate } from "react-router-dom"

type Inputs = {
  email: string
  room: string
}

const LobbyPage = () => {
  const [inputs, setInputs] = useState<Inputs>({
    email: '',
    room: ''
  })

  const socket = useSocket()
  const navigate = useNavigate()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }))
  }

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket?.emit("room:join", inputs)
  }, [inputs, socket])


  const joinRoom = useCallback(({ email, room }: Inputs) => {
    // console.log(room, email)
    navigate(`/room/${room}`)
  }, [])


  useEffect(() => {
    socket?.on("room:join", joinRoom)

    return () => {
      socket?.off("room:join", joinRoom)
    }
  }, [socket])

  return (
    <div className="w-full flex items-center flex-col">
      <h2 className="font-semibold text-4xl py-4">Waiting Room</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" className="border px-2 py-1 ml-2" value={inputs.email} onChange={handleChange} name="email" />
        </label>
        <label>
          Room No:
          <input type="text" className="border px-2 py-1 ml-2" value={inputs.room} onChange={handleChange} name="room" />
        </label>
        <button type="submit" className="py-2 px-4 border border-black bg-slate-300 hover:bg-slate-400 transition-all duration-75 my-2 rounded-md">Submit</button>
      </form>
    </div>
  )
}

export default LobbyPage