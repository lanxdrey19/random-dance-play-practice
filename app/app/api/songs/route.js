import connectDB from "../../utils/db";
import Song from "../../models/Song";
import { NextResponse } from "next/server";

connectDB();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");

  try {
    let songs;
    if (tags) {
      songs = await Song.find({ tags: { $in: tags.split(",") } });
    } else {
      songs = await Song.find();
    }

    return NextResponse.json(songs, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    return NextResponse.json({ error: "Failed to fetch songs" });
  }
}
