"use client";

import Link from "next/link";
import { Howl, Howler } from "howler";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  const [currentSong, setCurrentSong] = useState(null);
  let currentIndex = 0;
  let fetchedSongs = await getData();

  const playSound = async () => {
    fetchedSongs = fetchedSongs.sort(() => Math.random() - 0.5);
    setIsPlaying(true);

    const playNextSong = () => {
      if (currentIndex >= fetchedSongs.length) {
        // All songs have been played
        console.log("All songs have been played");
        currentIndex = 0;
        setIsPlaying(false);
        setCurrentSong(null);
        return;
      }

      const { link, duration, offset } = fetchedSongs[currentIndex];
      console.log(fetchedSongs[currentIndex]);
      setCurrentSong(fetchedSongs[currentIndex]);
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
  };

  return (
    <>
      <h1>Practice</h1>
      <button onClick={playSound} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Play"}
      </button>
      <h1>
        {currentSong
          ? `Currently playing: ${currentSong.title} - ${currentSong.artist}`
          : "No song playing"}
      </h1>
      <Link href="/">Home</Link>
    </>
  );
}
