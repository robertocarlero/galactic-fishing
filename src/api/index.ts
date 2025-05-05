import { BLOQUE_API_URL } from "@constants/config";

import type { MarketItem } from "types/market";
import type { User } from "types/users";

export const getLeaderBoard = async () => {
  try {
    const response = await fetch(`${BLOQUE_API_URL}/game/leaderboard`);
    const { players = [] } = (await response.json()) as unknown as {
      players: User[];
    };
    return { items: players, error: false };
  } catch (error) {
    console.error(error);
    return { items: [], error: true };
  }
};

export const getMarketItems = async () => {
  try {
    const response = await fetch(`${BLOQUE_API_URL}/game/market`);
    const { items = [] } = (await response.json()) as unknown as {
      items: MarketItem[];
    };
    return { items, error: false };
  } catch (error) {
    console.error(error);
    return { items: [], error: true };
  }
};
