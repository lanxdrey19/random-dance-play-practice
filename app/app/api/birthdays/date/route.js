import axios from "axios";
import cheerio from "cheerio";
import { NextResponse } from "next/server";
import httpStatus from "http-status";

export async function GET(req, res) {
  try {
    const bdayDate = [];
    await axios(process.env.FANDOM_BASE_URL + process.env.FANDOM_MAINPAGE)
      .then((response) => {
        const html = response.data;
        const websiteData = cheerio.load(html);

        websiteData(
          "#mw-content-text > div > div.main-page-tag-rcs > div.rcs-container > p > b",
          html
        ).each(function () {
          const date = websiteData(this).text();
          //const link = websiteData(this).find("a").attr("href");
          bdayDate.push({ date });
        });
      })
      .catch((err) => console.log(err));

    return NextResponse.json(bdayDate, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Error fetching date:", err.message);
    return NextResponse.json({ error: "Failed to fetch date" });
  }
}
