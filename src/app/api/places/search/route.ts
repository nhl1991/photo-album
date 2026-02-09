import { findPlacesByQuery } from "@/lib/findPlacesByQuery";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { query } = await req.json();
    await findPlacesByQuery(query);

    return NextResponse.json({message: 'OK'}, {status: 200})
}