import { createContext, useContext, useMemo } from "react";
import { Socket, io } from "socket.io-client";

type SocketType = Socket | null;

const SocketContext = createContext<SocketType>(null)

export const useSocket = () => {
  const socket = useContext(SocketContext)
  return socket
}

export const SocketProvider = ({ children }: { children: React.ReactNode}) => {
  const socket = useMemo(() => io(import.meta.env.VITE_API_SOCKET_URL), [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}