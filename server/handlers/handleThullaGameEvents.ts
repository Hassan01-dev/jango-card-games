import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { ThullaApproveRequestCardEventData, ThullaCreateRoomEventData, ThullaEventType, ThullaJoinGameEventData, ThullaRejectRequestCardEventData, ThullaRequestCardEventData, ThullaStartGameEventData } from "../types/thulla.ts";
import { handeleAutoPlayCard } from "./thulla/handleAutoPlayCard.ts";
import { handleCreateRoomEvent } from "./thulla/handleCreateGame.ts";
import { handleJoinGame } from "./thulla/handleJoinGame.ts";
import { handleKickPlayer } from "./handleKickPlayer.ts";
import { handleApproveRequestCard, handleRejectRequestCard, handleRequestCard } from "./thulla/handleRequestCard.ts";
import { handleStartGame } from "./thulla/handleStartGame.ts";
import { handleAudioMessage } from "./handleAudioMessage.ts"
import { handleGameChat } from "./handleGameChat.ts"
import { handlePlayCard } from "./thulla/handlePlayCard.ts";
import { AudioMessageType, GameChatEventData, KickPlayerEventData, PlayCardEventData } from "../types/main.ts";
import { getThullaRoom } from "../state/thullaRoomManager.ts";

const handleThullaGameEvents = async (
  socket: any,
  io: any,
  event_type: ThullaEventType,
  data: any
) => {
  switch (event_type) {
    case "create_room":
      await handleCreateRoomEvent(socket, io, data as ThullaCreateRoomEventData);
      break;
    case "join_game":
      await handleJoinGame(socket, io, data as ThullaJoinGameEventData);
      break;
    case "game_chat":
      await handleGameChat(socket, io, "thulla", data as GameChatEventData);
      break;
    case "play_card":
      await handlePlayCard(socket, io, data as PlayCardEventData);
      break;
    case "start_game":
      await handleStartGame(socket, io, data as ThullaStartGameEventData);
      break;
    case "request_card":
      await handleRequestCard(socket, io, data as ThullaRequestCardEventData);
      break;
    case "approve_request_card":
      await handleApproveRequestCard(
        socket,
        io,
        data as ThullaApproveRequestCardEventData
      );
      break;
    case "reject_request_card":
      await handleRejectRequestCard(
        socket,
        io,
        data as ThullaRejectRequestCardEventData
      );
      break;
    case "kick_player":
      const { roomId } = data as { roomId: string, playerId: string, ownerId: string };
      const targetRoom = getThullaRoom(roomId);
      await handleKickPlayer(socket, io, { ...data, targetRoom, game: "thulla"} as KickPlayerEventData);
      break;
    case "auto_play_card":
      await handeleAutoPlayCard(socket, io, data as { roomId: string });
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
