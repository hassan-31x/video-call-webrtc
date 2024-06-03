import { Route, Routes } from 'react-router-dom'
import './App.css'
import LobbyPage from './pages/Lobby'
import RoomPage from './pages/Room'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  )
}

export default App
