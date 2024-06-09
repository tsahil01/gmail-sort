import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { runGemini } from "@/lib/gemini";
import { google, gmail_v1 } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPayload {
  headers: EmailHeader[];
  body: {
    size: number;
    data?: string;
  };
  parts?: Array<{
    body: {
      size: number;
      data?: string;
    };
  }>;
}

interface Email {
  payload: EmailPayload;
  labelIds?: string[];
}

async function getImpData(email: gmail_v1.Schema$Message) {
  const headers = email.payload?.headers || [];
  const subject = headers.find((header) => header.name === 'Subject')?.value || '';
  const from = headers.find((header) => header.name === 'From')?.value || '';
  const date = headers.find((header) => header.name === 'Date')?.value || '';
  const read = email.labelIds?.includes('UNREAD') ? "Unread" : "Read";

  let htmlBody = "";

  if (email.payload?.body?.size && email.payload.body.data && email.payload.mimeType === 'text/html') {
    htmlBody = Buffer.from(email.payload.body.data, 'base64').toString('utf-8');
  } else if (email.payload?.parts) {
    for (const part of email.payload.parts) {
      // @ts-ignore
      if (part.body.size && part.body.data && part.mimeType === 'text/html') {
        // @ts-ignore
        htmlBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
        break; // Stop after finding the first HTML part
      }
    }
  }

  return {
    subject,
    from,
    date,
    htmlBody,
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
    const messages = response.data.messages || [];

    const emailPromisesArray = messages.map(async (message) => {
        // @ts-ignore
      const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
    //   @ts-ignore
      return getImpData(email.data);
    });

    const emails = await Promise.all(emailPromisesArray);

    // const extractedData = emails.map(({ subject, from, date }) => ({ subject, from, date }));

    // const classifications = await runGemini(extractedData, reqData.apiKey || process.env.GEMINI_API_KEY || "");

    // for (let i = 0; i < emails.length; i++) {
    //   if (classifications && classifications[i] && classifications[i].classify) {
    //     emails[i].classify = classifications[i].classify;
    //   }
    // }

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
