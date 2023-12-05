"use server"

import { cookies } from "next/headers";

export const getProfileName = () => {
  return cookies().get("playerName")?.value
}