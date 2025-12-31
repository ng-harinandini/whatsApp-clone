import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContextProvider";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// const SOCKET_URL = "http://172.16.17.27:3000";
const SOCKET_URL = "http://localhost:3000";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    if (socketRef.current) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
      console.log("Joining room:", user._id);

      socketRef.current?.emit("join-room", user._id);
      setSocket(socketRef.current);
    });

    

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocket(null);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
