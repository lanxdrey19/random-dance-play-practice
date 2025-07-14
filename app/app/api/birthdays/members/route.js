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
      let fullText = $(this).text().trim();

      const isBirthdayLine =
        fullText.startsWith("(") &&
        fullText[3] === ")" &&
        !isNaN(parseInt(fullText.substring(1, 3)));

      if (!isBirthdayLine) return;

      const groupMatch = fullText.match(/\(([^)]+)\)\s*$/);
      const group = groupMatch ? groupMatch[1].trim() : null;

      if (groupMatch) {
        fullText = fullText.replace(groupMatch[0], "").trim();
      }

      const anchors = $(this).find("a");

      anchors.each((_, anchor) => {
        const anchorText = $(anchor).text().trim();
        const href = $(anchor).attr("href");

        if (group && group.includes(anchorText)) return;

        if (anchorText && href) {
          arrayInfo.push({
            idolName: anchorText,
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
        const $profile = cheerio.load(htmlProfile);

        const thumbnail = $profile(".pi-image-thumbnail").attr("src");
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
