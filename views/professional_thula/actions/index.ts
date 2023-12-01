"use server"

import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { GameSettingType } from "./type";
const { v4: uuidv4 } = require("uuid");
import { cookies } from 'next/headers'


export const createGame = async (gameSetting: GameSettingType, playerName: string) => {
  if (!cookies().get("playerName")?.value) {
    cookies().set('playerName', playerName)
  }

  connect();

  const inviteId = uuidv4();
  const newGame = new CardGame({ ...gameSetting, inviteId });
  const savedGame = await newGame.save()
  return savedGame._id;
};
