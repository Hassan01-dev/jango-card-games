import { AudioMessageType, EventType, GameChatEventData, KickPlayerEventData } from "../types/main.ts";
import { CreateRoomEventData, JoinGameEventData } from "../types/thulla.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { handleCreateRoomEvent } from "./gulam_chor/handleCreateGame.ts";
import { handleJoinGame } from "./gulam_chor/handleJoinGame.ts";
import { handleKickPlayer } from "./gulam_chor/handleKickPlayer.ts";
import { handleAudioMessage } from "./handleAudioMessage.ts"
import { handleGameChat } from "./handleGameChat.ts"


const handleThullaGameEvents = async (
  socket: any,
  io: any,
  event_type: EventType,
  data: any
) => {
  switch (event_type) {
    case "create_room":
      await handleCreateRoomEvent(socket, io, data as CreateRoomEventData);
      break;
    case "join_game":
      await handleJoinGame(socket, io, data as JoinGameEventData);
      break;
    case "game_chat":
      await handleGameChat(socket, io, "thulla", data as GameChatEventData);
      break;
    case "kick_player":
      await handleKickPlayer(socket, io, data as KickPlayerEventData);
      break;
    case "audio_message":
      await handleAudioMessage(socket, io, "thulla", data as AudioMessageType);
      break;
    default:
      console.warn("Unknown event_type:", event_type);
      await sendEncryptedEvent(
        "thulla",
        "error",
        {
          message: `Unknown event_type: ${event_type}`,
        },
        socket.id,
        io
      );
  }
};

export default handleThullaGameEvents;
