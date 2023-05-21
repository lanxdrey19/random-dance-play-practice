"use client";

import Link from "next/link";
import { Howl, Howler } from "howler";
import { useState } from "react";

async function getData() {
  const res = await fetch(process.env.LOCALHOST_BASE_URL + "songs");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Practice() {
  const [isPlaying, setIsPlaying] = useState(false);
  let currentIndex = 0;
  let fetchedSongs = await getData();
  const playSound = async () => {
    fetchedSongs = fetchedSongs.sort(() => Math.random() - 0.5);
    setIsPlaying(true);
    //console.log(process.env.AUDIO_LINK);

    const playNextSong = () => {
      if (currentIndex >= fetchedSongs.length) {
        // All songs have been played
        console.log("All songs have been played");
        currentIndex = 0;
        setIsPlaying(false);
        return;
      }

      const { link, duration, offset } = fetchedSongs[currentIndex];

      const sound = new Howl({
        src: [link],
        html5: true,
        autoplay: true,
        sprite: {
          snippet: [
            offset * parseInt(process.env.ONE_MILLISECOND, 10),
            duration * parseInt(process.env.ONE_MILLISECOND, 10),
          ],
        },
        onend: function () {
          sound.stop();
          currentIndex++;
          setTimeout(playNextSong, parseInt(process.env.ONE_MILLISECOND, 10)); // Delay before playing the next song (2 seconds = 2000 milliseconds)
        },
      });

      sound.play("snippet");
    };

    playNextSong(); // Start playing the first song

    //console.log("pressed2");
  };

  return (
    <>
      <h1>Practice</h1>
      <button onClick={playSound} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Play"}
      </button>
      <Link href="/">Home</Link>
    </>
  );
}
