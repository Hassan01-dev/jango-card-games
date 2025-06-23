"use server";

import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { CreateGameSettingType, JoinGameSettingType } from "./type";
import { cookies } from "next/headers";

export const createGame = async (
  gameSetting: CreateGameSettingType,
  playerName: string
) => {
  if (!cookies().get("playerName")?.value) {
    cookies().set("playerName", playerName);
  }

  connect();

  const newGame = new CardGame({ ...gameSetting });
  const savedGame = await newGame.save();
  return savedGame._id;
};

export const findGame = async (
  gameSetting: JoinGameSettingType,
  playerName: string
) => {
  cookies().set("playerName", playerName);

  connect();

  try {
    const cardGame = await CardGame.findOne({ ...gameSetting });
    if (!cardGame) {
      throw new Error("Card game not found");
    }

    return cardGame;
  } catch (error) {
    console.error("Error Joining game:", error);
  }
};
