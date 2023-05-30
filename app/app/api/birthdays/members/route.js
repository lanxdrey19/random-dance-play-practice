import axios from "axios";
import cheerio from "cheerio";
import { NextResponse } from "next/server";
import httpStatus from "http-status";

export async function GET(req, res) {
  try {
    const arrayInfo = [];
    await axios(process.env.FANDOM_BASE_URL + process.env.FANDOM_MAINPAGE)
      .then((response) => {
        const html = response.data;
        const websiteData = cheerio.load(html);

        websiteData("li", html).each(async function () {
          const info = websiteData(this).text();

          const infoSubstr = info.substring(1, 3);
          const potentialNumber = parseInt(infoSubstr);
          if (
            Number.isInteger(potentialNumber) &&
            info.substring(0, 1) === "(" &&
            info.substring(3, 4) === ")"
          ) {
            const link =
              process.env.FANDOM_BASE_URL +
              websiteData(this).find("a").attr("href");
            arrayInfo.push({ info, link });
          }
        });
      })
      .catch((err) => console.log(err));
    let finalArray = [];

    for (let i = 0; i < arrayInfo.length; i++) {
      await axios(arrayInfo[i].link).then((res) => {
        const htmlProfile = res.data;
        const secondPageData = cheerio.load(htmlProfile);
        const idolName = arrayInfo[i].info.substring(
          5,
          arrayInfo[i].info.length
        );
        secondPageData(".pi-image-thumbnail", htmlProfile).each(function () {
          const imgSrc = secondPageData(this).attr("src").split("/revision")[0];
          finalArray.push({
            idolName,
            imgSrc,
          });
        });
      });
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
