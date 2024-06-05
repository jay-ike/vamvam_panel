import io from "socket.io-client";
import { STORAGE_KEY } from "./enums";
import { RegistrationData } from "../models/registrations/registration-data";

const url = `${import.meta.env.VITE_API_URL}`;

const token = localStorage.getItem(STORAGE_KEY.token);

console.log("token", token);

const socket = io(url, {
  auth: {
    authorization: `Bearer ${token}`,
  },
  // transports: ["websocket"],
});

function connectSocketIO() {
  if (!socket.connected) {
    listenToSocketStatus();
    socket.connect();
  }
}

function listenToSocketStatus() {
  socket.on("connect", () => {
    console.log("connected to socket");
  });

  socket.on("disconnect", () => {
    console.log("disconnected from socket");
  });

  socket.on("connect_error", (error) => {
    console.log("socket connection error", error);
  });
}

function handleIncomingRegistration(
  onHandleNewRegistration: (data: RegistrationData) => void
) {
  socket.on("new-registration", (data: RegistrationData) => {
    console.log("new registration from socket IO", data);
    onHandleNewRegistration(data);
  });
}

export { connectSocketIO, handleIncomingRegistration };
