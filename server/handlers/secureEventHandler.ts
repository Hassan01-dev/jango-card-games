import { decryptPayload } from "../utils/crypto.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { handleCreateRoomEvent } from "./handleCreateGame.ts";
import { handleGameChat } from "./gameChat.ts";
import { handlePlayCard } from "./playCard.ts";
import { handleWon } from "./won.ts";
import { handleStartGame } from "./handleStartGame.ts";
import { handleJoinGame } from "./handleJoinGame.ts";
import {
  handleRequestCard,
  handleApproveRequestCard,
  handleRejectRequestCard,
} from "./handleRequestCard.ts";
import { handleKickPlayer } from "./handleKickPlayer.ts";
import {
  CreateRoomEventData,
  JoinGameEventData,
  SecureEventPayload,
  GameChatEventData,
  PlayCardEventData,
  StartGameEventData,
  WonEventData,
  RequestCardEventData,
  ApproveRequestCardEventData,
  RejectRequestCardEventData,
  KickPlayerEventData,
} from "../utils/types.ts";
import { handeleAutoPlayCard } from "./handleAutoPlayCard.ts";

export function handleSecureEvent(socket: any, io: any) {
  socket.on("secure_event", async (encryptedPayload: string) => {
    try {
      const { event_type, data } = (await decryptPayload(
        encryptedPayload
      )) as SecureEventPayload;

      switch (event_type) {
        case "create_room":
          await handleCreateRoomEvent(socket, io, data as CreateRoomEventData);
          break;
        case "join_game":
          await handleJoinGame(socket, io, data as JoinGameEventData);
          break;
        case "game_chat":
          await handleGameChat(socket, io, data as GameChatEventData);
          break;
        case "play_card":
          await handlePlayCard(socket, io, data as PlayCardEventData);
          break;
        case "start_game":
          await handleStartGame(socket, io, data as StartGameEventData);
          break;
        case "won":
          await handleWon(socket, io, data as WonEventData);
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
        default:
          console.warn("Unknown event_type:", event_type);
          await sendEncryptedEvent(
            "error",
            {
              message: `Unknown event_type: ${event_type}`,
            },
            socket.id,
            io
          );
      }
    } catch (error: any) {
      console.error("Failed to process secure_event:", error.message);
      await sendEncryptedEvent(
        "error",
        {
          message: "Invalid or corrupted payload",
        },
        socket.id,
        io
      );
    }
  });
}
