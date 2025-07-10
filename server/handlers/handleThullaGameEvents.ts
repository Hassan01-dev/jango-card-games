import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { ApproveRequestCardEventData, AudioMessageType, CreateRoomEventData, EventType, GameChatEventData, JoinGameEventData, KickPlayerEventData, PlayCardEventData, RejectRequestCardEventData, RequestCardEventData, StartGameEventData } from "../utils/types.ts";
import { handeleAutoPlayCard } from "./thulla/handleAutoPlayCard.ts";
import { handleCreateRoomEvent } from "./thulla/handleCreateGame.ts";
import { handleJoinGame } from "./thulla/handleJoinGame.ts";
import { handleKickPlayer } from "./thulla/handleKickPlayer.ts";
import { handleApproveRequestCard, handleRejectRequestCard, handleRequestCard } from "./thulla/handleRequestCard.ts";
import { handleStartGame } from "./thulla/handleStartGame.ts";
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
    case "play_card":
      await handeleAutoPlayCard(socket, io, data as PlayCardEventData);
      break;
    case "start_game":
      await handleStartGame(socket, io, data as StartGameEventData);
      break;
    case "request_card":
      await handleRequestCard(socket, io, data as RequestCardEventData);
      break;
    case "approve_request_card":
      await handleApproveRequestCard(
        socket,
        io,
        data as ApproveRequestCardEventData
      );
      break;
    case "reject_request_card":
      await handleRejectRequestCard(
        socket,
        io,
        data as RejectRequestCardEventData
      );
      break;
    case "kick_player":
      await handleKickPlayer(socket, io, data as KickPlayerEventData);
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
