import axios from "axios";
import cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const arrayInfo = [];

    const response = await axios(
      process.env.FANDOM_BASE_URL + process.env.FANDOM_MAINPAGE
    );
    const html = response.data;
    const $ = cheerio.load(html);

    $("li", html).each(function () {
      const info = $(this).text();

      const isBirthdayLine =
        info.startsWith("(") &&
        info[3] === ")" &&
        !isNaN(parseInt(info.substring(1, 3)));

      if (!isBirthdayLine) return;

      const anchors = $(this).find("a");
      const count = anchors.length;

      if (count === 0) return;

      const group =
        count > 1
          ? $(anchors[count - 1])
              .text()
              .trim()
          : null;

      const idolAnchors = count > 1 ? anchors.slice(0, count - 1) : anchors;

      idolAnchors.each((_, anchor) => {
        const idolName = $(anchor).text().trim();
        const href = $(anchor).attr("href");
        if (idolName && href) {
          arrayInfo.push({
            idolName,
            group,
            link: process.env.FANDOM_BASE_URL + href,
          });
        }
      });
    });

    const finalArray = [];
    for (const { idolName, group, link } of arrayInfo) {
      try {
        const res = await axios(link);
        const htmlProfile = res.data;
        const secondPageData = cheerio.load(htmlProfile);

        const thumbnail = secondPageData(".pi-image-thumbnail").attr("src");
        const imgSrc = thumbnail ? thumbnail.split("/revision")[0] : null;

        finalArray.push({
          idolName,
          group,
          imgSrc,
        });
      } catch (err) {
        console.error(`Error fetching profile for ${idolName}:`, err.message);
      }
    }

    return NextResponse.json(finalArray, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Error fetching members:", err.message);
    return NextResponse.json({ error: "Failed to fetch members" });
  }
}
