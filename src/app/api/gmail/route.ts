import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { runGemini } from "@/lib/gemini";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function getImpData(email: any, maxLength: number) {
    const headers = email.payload.headers;
    const subject = headers.find((header: any) => header.name === 'Subject')?.value;
    const from = headers.find((header: any) => header.name === 'From')?.value;
    const date = headers.find((header: any) => header.name === 'Date')?.value;
    const read = email.labelIds?.includes('UNREAD') ? "Unread" : "Read";

    let body = "";

    if (email.payload.body.size > 0 && email.payload.body.data) {
        body = Buffer.from(email.payload.body.data, 'base64').toString('utf-8');
        // Remove HTML tags
        body = body.replace(/<[^>]*>\r\n/g, '');
        // Truncate the body text if it exceeds maxLength
        body = body.length > maxLength ? body.substring(0, maxLength) + "..." : body;
    } else if (email.payload.parts) {
        email.payload.parts.forEach((part: any) => {
            if (part.body.size > 0 && part.body.data) {
                let partBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
                partBody = partBody.replace(/<[^>]*>/g, '');
                body += partBody.length > maxLength ? partBody.substring(0, maxLength) + "..." : partBody;
            }
        });
    }

    return {
        subject,
        from,
        date,
        // body,
        read,
        classify: ""
    };
}

export async function POST(req: NextRequest) {

    const reqData = await req.json();

    const session = await getServerSession(NEXTAUTH_CONFIG);

    if (!session) {
        return NextResponse.json({
            msg: "Unauthorized Access",
            data: null
        });
    }

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: session.accessToken
    });

    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
        const messages = response.data.messages;
        // console.log("Messages: ", messages);

        const emailPromisesArray = messages?.map(async (message) => {
            const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
            // console.log("Email: ", email);
            return getImpData(email.data, 50);
        });

        const emails = await Promise.all(emailPromisesArray || []);

        console.log("Emails: ", emails);

        const extractedData = emails.map(({ subject, from, date }) => ({ subject, from, date }));

        const classifications = await runGemini(extractedData, reqData.apiKey || process.env.GEMINI_API_KEY || "");
        // console.log("Classifications: ", classifications);

        for (let i = 0; i < emails.length; i++) {
            if (classifications && classifications[i] && classifications[i].classify) {
                emails[i].classify = classifications[i].classify;
                // emails[i].body = classifications[i].body;
            }
        }
        
        return NextResponse.json({
            session: session,
            emailResponse: emails,
        });

    } catch (error: any) {
        console.error("Error fetching emails: ", error);
        return NextResponse.json({
            msg: "Error",
            error: {
                code: error.code,
                message: error.message,
                stack: error.stack,
            }
        });
    }
}
