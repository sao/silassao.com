"use client";

import { useScramble } from "use-scramble";

export default function TextScramble({ text }: { text: string }) {
  const { ref } = useScramble({
    text,
    speed: 0.8,
    tick: 1,
    step: 1,
    scramble: 5,
    seed: 2,
  });

  return <span ref={ref} />;
}
