import { getGulamChorRoom } from "../state/gulamChorRoomManager.ts";
import { GulamChorCreateRoomEventData, GulamChorEventType, GulamChorJoinGameEventData, GulamChorStartGameEventData } from "../types/gulamChor.ts";
import { AudioMessageType, GameChatEventData, KickPlayerEventData } from "../types/main.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { handleCreateRoomEvent } from "./gulam_chor/handleCreateGame.ts";
import { handleJoinGame } from "./gulam_chor/handleJoinGame.ts";
import { handleKickPlayer } from "./handleKickPlayer.ts";
import { handleAudioMessage } from "./handleAudioMessage.ts"
import { handleGameChat } from "./handleGameChat.ts"
import { handleStartGame, handleStartGameWithHiddenCard } from "./gulam_chor/handleStartGame.ts";


const handleGulamChorEvents = async (
  socket: any,
  io: any,
  event_type: GulamChorEventType,
  data: any
) => {
  switch (event_type) {
    case "create_room":
      await handleCreateRoomEvent(socket, io, data as GulamChorCreateRoomEventData);
      break;
    case "join_game":
      await handleJoinGame(socket, io, data as GulamChorJoinGameEventData);
      break;
    case "start_game":
      await handleStartGame(socket, io, data as GulamChorStartGameEventData);
      break;
    case "start_game_with_hidden_card":
      await handleStartGameWithHiddenCard(socket, io, data as GulamChorStartGameEventData);
      break;
    case "game_chat":
      await handleGameChat(socket, io, "gulam_chor", data as GameChatEventData);
      break;
    case "kick_player":
      const { roomId } = data as { roomId: string, playerId: string, ownerId: string };
      const targetRoom = getGulamChorRoom(roomId);
      await handleKickPlayer(socket, io, { ...data, targetRoom, game: "gulam_chor"} as KickPlayerEventData);
      break;
    case "audio_message":
      await handleAudioMessage(socket, io, "gulam_chor", data as AudioMessageType);
      break;
    default:
      console.warn("Unknown event_type:", event_type);
      await sendEncryptedEvent(
        "gulam_chor",
        "error",
        {
          message: `Unknown event_type: ${event_type}`,
        },
        socket.id,
        io
      );
  }
};

export default handleGulamChorEvents;
