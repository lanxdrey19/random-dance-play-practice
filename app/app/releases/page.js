"use client";

import Link from "next/link";

const fetchReleases = async () => {
  try {
    const response = await fetch(process.env.LOCALHOST_BASE_URL + "releases");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching releases:", error);
  }
};

export default async function Releases() {
  const allReleases = await fetchReleases();

  return (
    <>
      <Link href="/">Home</Link>

      <h3>This month's releases</h3>
      <ul>
        {allReleases.map((releaseItem) => (
          <li key={releaseItem.track}>
            <p>{releaseItem.day}</p>
            <p>{releaseItem.artist}</p>
            <p>{releaseItem.track}</p>
            <img src={releaseItem.imgSrc} alt={releaseItem.track} />
          </li>
        ))}
      </ul>
    </>
  );
}
