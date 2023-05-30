import axios from "axios";
import cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const arrayNews = [];
    await axios(process.env.NEWS_SOURCE)
      .then((response) => {
        const html = response.data;
        const websiteData = cheerio.load(html);

        websiteData(".y8HYJ-y_lTUHkQIc1mdCq", html).each(function () {
          const info = websiteData(this)
            .find("a")
            .find("div")
            .find("h3")
            .text();
          const link =
            process.env.NEWS_BASE + websiteData(this).find("a").attr("href");

          arrayNews.push({ info, link });
        });
      })
      .catch((err) => console.log(err));

    return NextResponse.json(arrayNews, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Error fetching news:", err.message);
    return NextResponse.json({ error: "Failed to fetch news" });
  }
}
