"use client";

import Link from "next/link";
import { Howl, Howler } from "howler";

export default function Practice() {
  const playSound = () => {
    console.log(process.env.AUDIO_LINK);
    const sound = new Howl({
      src: [process.env.AUDIO_LINK],
      html5: true,
      autoplay: true,
      sprite: {
        snippet: [10000, 5000],
      },
      onend: function () {
        sound.stop();
      },
    });
    sound.play("snippet");
    console.log("pressed2");
  };

  return (
    <>
      <h1>Practice</h1>
      <button onClick={playSound}>Play</button>
      <Link href="/">Home</Link>
    </>
  );
}
