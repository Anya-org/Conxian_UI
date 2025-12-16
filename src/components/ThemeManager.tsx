"use client";

import { useEffect } from "react";
import { hasBitcoinMonkeyNft } from "@/lib/nft-theming";

export default function ThemeManager() {
  useEffect(() => {
    async function checkNft() {
      const hasNft = await hasBitcoinMonkeyNft();
      if (hasNft) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("monkey");
      }
    }
    checkNft();
  }, []);

  return null;
}
