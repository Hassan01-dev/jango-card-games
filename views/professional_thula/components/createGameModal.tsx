"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { createGame } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Component({ playerName }: { playerName: string }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [gameSetting, setGameSetting] = useState<{
    playerCount: number;
    requirePassword: boolean;
    roomName: string;
    roomPassword: string;
  }>({
    playerCount: 4,
    requirePassword: false,
    roomName: "",
    roomPassword: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "checkbox") {
      setGameSetting({
        ...gameSetting,
        [e.target.name]: e.target.checked,
      });
    } else {
      setGameSetting({ ...gameSetting, [e.target.name]: e.target.value });
    }
  };

  const handleCreateGame = async () => {
    
    const roomId = await createGame(gameSetting, playerName);
    router.push(`/professional_thula/room/${roomId}`);
  };

  const { playerCount, requirePassword, roomName, roomPassword } = gameSetting;

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="px-4 py-2 mx-auto my-2 rounded-full w-full justify-center"
      >
        Create Game
      </Button>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Game Settings
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="roomName" value="Room Name" />
              </div>
              <TextInput
                id="roomName"
                name="roomName"
                value={roomName}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="playerCount" value="Player Count" />
              </div>
              <TextInput
                type="number"
                id="playerCount"
                name="playerCount"
                value={playerCount}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="requirePassword"
                name="requirePassword"
                checked={requirePassword}
                onChange={handleFormChange}
              />
              <Label htmlFor="requirePassword">
                Require Password to Join the Room
              </Label>
            </div>
            {requirePassword && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="roomPassword" value="Your password" />
                </div>
                <TextInput
                  id="roomPassword"
                  name="roomPassword"
                  value={roomPassword}
                  onChange={handleFormChange}
                  required
                />
              </div>
            )}
            <div className="w-full">
              <Button onClick={handleCreateGame}>Create Room</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
