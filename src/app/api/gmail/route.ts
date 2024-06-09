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

async function getImpData(email: gmail_v1.Schema$Message, maxLength: number) {
  const headers = email.payload?.headers || [];
  const subject = headers.find((header) => header.name === 'Subject')?.value || '';
  const from = headers.find((header) => header.name === 'From')?.value || '';
  const date = headers.find((header) => header.name === 'Date')?.value || '';
  const read = email.labelIds?.includes('UNREAD') ? "Unread" : "Read";

  let body = "";

  if (email.payload?.body?.size && email.payload.body.data) {
    body = Buffer.from(email.payload.body.data, 'base64').toString('utf-8');
    // Remove HTML tags
    body = body.replace(/<[^>]*>\r\n/g, '');
    // Truncate the body text if it exceeds maxLength
    body = body.length > maxLength ? body.substring(0, maxLength) + "..." : body;
  } else if (email.payload?.parts) {
    email.payload.parts.forEach((part) => {
        // @ts-ignore
      if (part.body.size > 0 && part.body.data) {
        // @ts-ignore
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
    body,
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
      return getImpData(email.data, 100);
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
