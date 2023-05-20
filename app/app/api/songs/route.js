import connectDB from "../../utils/db";
import Song from "../../models/Song";
import { NextResponse } from "next/server";

connectDB();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");
  console.log(tags);
  try {
    let songs;
    if (tags) {
      songs = await Song.find({ tags: { $in: tags.split(",") } });
    } else {
      songs = await Song.find();
    }
    console.log(songs);

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    return NextResponse.json({ error: "Failed to fetch songs" });
  }
}
