"use client";

import CreateGameModal from "@/views/professional_thula/createGameModal";
import JoinGameModal from "@/views/professional_thula/joinGameModal";
import { Label, TextInput } from "flowbite-react";
import { useState } from "react";

export default function Game() {
  const [playerName, setPlayerName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  return (
    <div className="mx-auto mt-24 w-1/3">
      <div className="flex items-center justify-between">
        <div className="mb-2 block">
          <Label htmlFor="player_name" value="Your Name" />
        </div>
        <TextInput
          id="player_name"
          className="w-3/4"
          addon="@"
          value={playerName}
          onChange={handleInputChange}
          required
        />
      </div>
      <CreateGameModal playerName={playerName} />
      <JoinGameModal playerName={playerName} />
    </div>
  );
}
