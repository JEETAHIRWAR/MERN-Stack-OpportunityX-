import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";
    const socketOrigin = apiBase.startsWith("http")
      ? apiBase.replace(/\/api\/?$/, "")
      : window.location.origin;
    socket = io(socketOrigin, {
      autoConnect: false,
      auth: { token: localStorage.getItem("token") },
    });
  }
  socket.auth = { token: localStorage.getItem("token") };
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
