import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({
            msg: "Hello World!"
        })
}

export async function POST(req: NextRequest){
    const data = await req.json()
    return NextResponse.json({
            msg: "Hello World!",
            data: data
        })
}