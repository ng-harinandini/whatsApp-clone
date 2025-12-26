import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// const SOCKET_URL = "http://172.16.17.27:3000";
const SOCKET_URL = "http://localhost:3000";


export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        // console.log("WebSocket connected:", socketRef.current?.id);
        setSocket(socketRef.current);
      });

      socketRef.current.on("disconnect", () => {
        // console.log("WebSocket disconnected");
        setSocket(null);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
