import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(NEXTAUTH_CONFIG);

    if(!session){
        return NextResponse.json({
            msg: "Unauthorized Access",
            data: null
        })
    }

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: session.accessToken
    })

    const gmail = google.gmail({version: 'v1', auth});

    try {
        const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

        return NextResponse.json({
            session: session,
            emailResponse: response.data,
        })
    } catch (error) {
        return NextResponse.json({
            msg: "Error",
            error: error
        })
    }
}
