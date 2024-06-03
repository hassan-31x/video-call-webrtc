import { Route, Routes } from 'react-router-dom'
import './App.css'
import LobbyPage from './pages/Lobby'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
      </Routes>
    </div>
  )
}

export default App
