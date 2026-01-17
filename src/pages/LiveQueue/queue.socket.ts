import { io } from "socket.io-client";

const QUEUE_SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const queueSocket = io(`${QUEUE_SOCKET_URL}/live-queue`, {
  withCredentials: true,
  autoConnect: false,
});
