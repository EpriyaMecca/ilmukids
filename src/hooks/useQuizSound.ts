import { useCallback } from "react";

export function useQuizSound() {
  const playBenar = useCallback(() => {
    const audio = new Audio("/sounds/correct.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  const playSalah = useCallback(() => {
    const audio = new Audio("/sounds/wrong.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  const playSelesai = useCallback(() => {
    const audio = new Audio("/sounds/complete.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  return { playBenar, playSalah, playSelesai };
}