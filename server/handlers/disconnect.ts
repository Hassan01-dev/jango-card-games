import { connections } from "../main.ts";
import { getAllRooms } from "../state/roomManager.ts";
import { getNextEligiblePlayer } from "../utils/helper.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import handleThullaDisconnect from "./thulla/handleDisconnect.ts";

const handleJackTheifDisconnect = (socket: any, io: any) => {
  
}

export function handleDisconnect(socket: any, io: any, ) {
  socket.on("disconnect", async () => {
    if (connections[socket.id]) {
      const { gameType } = connections[socket.id]

      switch (gameType) {
        case "thulla":
          handleThullaDisconnect(socket, io);
          break;
        case "jack_theif": 
          handleJackTheifDisconnect(socket, io);
          break;
      }
    }
  });
}
