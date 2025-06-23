import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketProps {
  url: string;
  options?: any;
}

const socket = io("http://localhost:3001");

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket>(socket);

  useEffect(() => {
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (eventName: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  };

  const on = (eventName: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  };

  const off = (eventName: string) => {
    if (socketRef.current) {
      socketRef.current.off(eventName);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
};
