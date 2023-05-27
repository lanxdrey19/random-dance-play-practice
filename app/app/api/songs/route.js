import connectDB from "../../utils/db";
import Song from "../../models/Song";
import { NextResponse } from "next/server";

let isDBConnected = false;

async function connectToDB() {
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");

  try {
    await connectToDB();
    let songs;
    if (tags) {
      songs = await Song.find({ tags: { $in: tags.split(",") } }).sort({
        artist: 1, // Sort in ascending order based on the artist field
      });
    } else {
      songs = await Song.find().sort({
        artist: 1, // Sort in ascending order based on the artist field
      });
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
