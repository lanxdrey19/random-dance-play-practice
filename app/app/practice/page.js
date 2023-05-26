"use client";

import Link from "next/link";
import { Howl, Howler } from "howler";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

async function getData() {
  const res = await fetch(process.env.LOCALHOST_BASE_URL + "songs");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Practice() {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  let currentIndex = 0;
  let fetchedSongs = await getData();

  const playSound = async () => {
    const selectedSongsToPlay = fetchedSongs.filter((song) =>
      selectedSongs.includes(song._id)
    );

    // Sort and play the selected songs
    selectedSongsToPlay.sort(() => Math.random() - 0.5);
    setIsPlaying(true);

    const playNextSong = () => {
      if (currentIndex >= selectedSongsToPlay.length) {
        // All songs have been played
        console.log("All songs have been played");
        currentIndex = 0;
        setIsPlaying(false);
        setCurrentSong(null);
        return;
      }

      const { link } = selectedSongsToPlay[currentIndex];
      console.log(selectedSongsToPlay[currentIndex]);
      setCurrentSong(selectedSongsToPlay[currentIndex]);
      const sound = new Howl({
        src: [link],
        html5: true,
        autoplay: true,
        onend: function () {
          sound.stop();
          currentIndex++;
          setTimeout(playNextSong, parseInt(process.env.ONE_MILLISECOND, 10)); // Delay before playing the next song (2 seconds = 2000 milliseconds)
        },
      });
      sound.play();
    };

    playNextSong(); // Start playing the first song
  };

  const handleSongSelection = (e, songId) => {
    if (e.target.checked) {
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, songId]);
    } else {
      setSelectedSongs((prevSelectedSongs) =>
        prevSelectedSongs.filter((id) => id !== songId)
      );
    }
  };

  const selectAllSongs = () => {
    const allSongIds = fetchedSongs.map((song) => song._id);
    setSelectedSongs(allSongIds);
  };

  const getUniqueTags = () => {
    const allTags = fetchedSongs.reduce(
      (tags, song) => [...tags, ...song.tags],
      []
    );
    return Array.from(new Set(allTags));
  };

  const handleTagSelection = (e, tag) => {
    if (e.target.checked) {
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
    } else {
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    }
  };

  const getFilteredSongs = () => {
    if (selectedTags.length === 0) {
      return fetchedSongs;
    }
    return fetchedSongs.filter((song) =>
      selectedTags.every((selectedTag) => song.tags.includes(selectedTag))
    );
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

      <h2>All Songs</h2>
      <ul>
        {getFilteredSongs().map((song) => (
          <li key={song._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedSongs.includes(song._id)}
                onChange={(e) => handleSongSelection(e, song._id)}
              />
              {song.title} - {song.artist}
            </label>
            <ul>
              {song.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h2>Filter by Tags</h2>
      <ul>
        {getUniqueTags().map((tag) => (
          <li key={tag}>
            <label>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={(e) => handleTagSelection(e, tag)}
              />
              {tag}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={selectAllSongs}>Select All</button>

      <button onClick={() => setSelectedSongs([])}>Clear Selection</button>
    </>
  );
}
