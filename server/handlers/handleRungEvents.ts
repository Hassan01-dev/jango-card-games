import { getRungRoom } from "../state/rungRoomManager.ts";
import { RungCreateRoomEventData, RungEventType, RungJoinGameEventData, RungRemovePairsEventData, RungStartGameEventData } from "../types/rung.ts";
import { AudioMessageType, GameChatEventData, KickPlayerEventData } from "../types/main.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { handleCreateRoomEvent } from "./rung/handleCreateGame.ts";
import { handleJoinGame } from "./rung/handleJoinGame.ts";
import { handleKickPlayer } from "./handleKickPlayer.ts";
import { handleAudioMessage } from "./handleAudioMessage.ts"
import { handleGameChat } from "./handleGameChat.ts"
import { handleStartGame, handleStartGameWithHiddenCard } from "./rung/handleStartGame.ts";


const handleRungEvents = async (
  socket: any,
  io: any,
  event_type: RungEventType,
  data: any
) => {
  switch (event_type) {
    case "create_room":
      await handleCreateRoomEvent(socket, io, data as RungCreateRoomEventData);
      break;
    case "join_game":
      await handleJoinGame(socket, io, data as RungJoinGameEventData);
      break;
    case "start_game":
      await handleStartGame(socket, io, data as RungStartGameEventData);
      break;
    case "start_game_with_hidden_card":
      await handleStartGameWithHiddenCard(socket, io, data as RungStartGameEventData);
      break;
    case "game_chat":
      await handleGameChat(socket, io, "rung", data as GameChatEventData);
      break;
    case "kick_player":
      const { roomId } = data as { roomId: string, playerId: string, ownerId: string };
      const targetRoom = getRungRoom(roomId);
      await handleKickPlayer(socket, io, { ...data, targetRoom, game: "rung"} as KickPlayerEventData);
      break;
    case "audio_message":
      await handleAudioMessage(socket, io, "rung", data as AudioMessageType);
      break;
    default:
      console.warn("Unknown event_type:", event_type);
      await sendEncryptedEvent(
        "rung",
        "error",
        {
          message: `Unknown event_type: ${event_type}`,
        },
        socket.id,
        io
      );
  }
};

export default handleRungEvents;
