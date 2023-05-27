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
  const [countdown, setCountdown] = useState(5); // Countdown value
  const [showCountdown, setShowCountdown] = useState(false);

  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedTags, setSelectedTags] = useState(["filmed", "non-filmed"]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  let currentIndex = 0;
  let fetchedSongs = await getData();

  const playSound = async () => {
    const selectedSongsToPlay = fetchedSongs.filter((song) =>
      selectedSongs.includes(song._id)
    );

    if (selectedSongsToPlay.length === 0) {
      alert("No songs selected");
      return;
    }

    // Sort and play the selected songs
    selectedSongsToPlay.sort(() => Math.random() - 0.5);
    setIsPlaying(true);

    const playNextSong = () => {
      if (currentIndex >= selectedSongsToPlay.length) {
        // All songs have been played

        currentIndex = 0;
        setIsPlaying(false);
        setCurrentSong(null);
        alert("All songs have been played");
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
          setTimeout(playNextSong, parseInt(process.env.ONE_MILLISECOND, 10));
        },
      });
      sound.play();
    };

    setShowCountdown(true); // Show the countdown

    // Countdown logic
    let count = 5;
    const countdownInterval = setInterval(() => {
      if (count > 0) {
        setCountdown(count);
        count--;
      } else {
        clearInterval(countdownInterval);
        setShowCountdown(false); // Hide the countdown
        playNextSong(); // Start playing the first song
      }
    }, parseInt(process.env.ONE_MILLISECOND, 10)); // 1-second interval
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
      selectedTags.some((selectedTag) => song.tags.includes(selectedTag))
    );
  };

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Practice</h1>
      {showCountdown && <h2>Starting playback in {countdown} seconds</h2>}
      <button onClick={playSound} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Play"}
      </button>
      <h1>
        {currentSong
          ? `Currently playing: ${currentSong.title} - ${currentSong.artist}`
          : "No song playing"}
      </h1>

      <h2>All Songs</h2>
      <button onClick={selectAllSongs}>Select All</button>

      <button onClick={() => setSelectedSongs([])}>Clear Selected Songs</button>
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

      <h3>
        {selectedTags.length === 0 &&
          `No Tags Selected, all songs will be displayed`}
      </h3>
    </>
  );
}
