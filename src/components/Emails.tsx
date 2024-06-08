"use client";


import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Emails() {

    const session = useSession();
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        async function getEmails(){
            if(session.status === "authenticated"){
                const res = await fetch("/api/gmail");
                const data = await res.json();
                const email = data.emailResponse;
                console.log(email);
                setEmails(email);
            }
        }
        getEmails();
    }
    , [session]);

    if (session.status === 'loading') {
        return <p>Loading...</p>;
      }

    return (
        <div className="p-4 m-6 bg-slate-200 border border-black">
            <h1 className="text-2xl">Emails</h1>
            <ul>
                {emails.map((email) => (
                    <li key={email.id} className="p-4 border border-red-500 m-5">
                        <h2 className="text-3xl font-bold">{email.subject}</h2>
                        <p>{email.from}</p>
                        <p>{email.read}</p>
                        <p>{email.date}</p>
                        <p>{email.body}</p>
                    </li>
                 ))}
            </ul>
        </div>
    )
}