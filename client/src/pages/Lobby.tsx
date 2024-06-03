import { useCallback, useState } from "react"

const LobbyPage = () => {
  const [inputs, setInputs] = useState({
    email: '',
    room: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }))
  }

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [inputs])

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