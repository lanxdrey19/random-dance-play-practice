"use client";

import Link from "next/link";

const fetchNews = async () => {
  try {
    const response = await fetch(process.env.LOCALHOST_BASE_URL + "news");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};

export default async function News() {
  const newsUpdates = await fetchNews();

  return (
    <>
      <Link href="/">Home</Link>

      <h3>News</h3>
      <ul>
        {newsUpdates.map((newsItem) => (
          <li key={newsItem.idolName}>
            <p>{newsItem.info}</p>
            <a href={newsItem.link} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
