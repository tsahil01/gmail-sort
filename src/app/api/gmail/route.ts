import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function getImpData(email: any) {
    const headers = email.payload.headers;
    const subject = headers.find((header: any) => header.name === 'Subject')?.value;
    const from = headers.find((header: any) => header.name === 'From')?.value;
    const date = headers.find((header: any) => header.name === 'Date')?.value;
    const read = email.labelIds?.includes('UNREAD') ? "Unread" : "Read";

    let body = "";

    if(email.payload.body.size > 0){
        body = Buffer.from(email.payload.body.data, 'base64').toString('utf-8');
    } else if(email.payload.parts){
        email.payload.parts.forEach((part: any) => {
            if(part.body.size > 0){
                body += Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
        });
    }

    return {
        subject,
        from,
        date,
        body,
        read,
    }
}

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
        const messages = response.data.messages;

        const emailPromisesArray = messages?.map(async (message) => {
            const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
            return getImpData(email.data);
        });

        const emails = await Promise.all(emailPromisesArray || []);

        return NextResponse.json({
            session: session,
            emailResponse: emails,
        })
    } catch (error) {
        return NextResponse.json({
            msg: "Error",
            error: error
        })
    }
}


