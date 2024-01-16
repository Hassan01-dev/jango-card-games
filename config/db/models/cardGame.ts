import mongoose from "mongoose";

const cardGame = new mongoose.Schema({
  roomName: String,
  roomPassword: String,
  loser: String,
  playerNames: [String],
  hands: [Object],
  playerCount: { type: "number", required: [true, "Player Count is required"] },
  requirePassword: { type: "boolean", default: false },
  isStarted: { type: "boolean", default: false },
  isCompleted: { type: "boolean", default: false },
});

const CardGame =
  mongoose.models.card_games || mongoose.model("card_games", cardGame);

export default CardGame;
