"use client";

import EmailComponent from "@/components/EmailComponent";
import Header from "@/components/Header";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();
  const [apiKey, setApiKey] = useState<any>("");
  const [emails, setEmails] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    if (session.status == "unauthenticated") {
      router.push("/");
      toast({
        title: "You are not logged in",
        description: "Please login to access this page",
      });
    } else {
      if (localStorage.getItem("Gemini Key")) {
        setApiKey(localStorage.getItem("Gemini Key"));

        const getEmails = async () => {
          setLoading(true); // Start loading
          try {
            console.log("Called");
            const res = await fetch("/api/gmail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ apiKey: apiKey }),
            });
            const data = await res.json();
            console.log("Data: ", data.emailResponse);
            setEmails(data.emailResponse);
          } catch (error) {
            console.error("Failed to fetch emails", error);
            toast({
              title: "Failed to fetch emails",
              description: "There was an error fetching the emails. Please try again later.",
            });
          } finally {
            setLoading(false); // End loading
          }
        };
        getEmails();
      } else {
        router.push("/");
        toast({
          title: "API Key not found",
          description: "Please enter your API key to access this page",
        });
      }
    }
  }, [session.status]);

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 w-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950 py-12 px-6 md:px-8">
        {loading ? (
          <Spinner /> 
        ) : (
          <EmailComponent data={emails} />
        )}
      </div>
      <footer className="bg-zinc-900 text-white py-4 px-6 md:px-8 text-center border-t">
        <p className="text-sm">&copy; 2024 Mail Sorter. All rights reserved.</p>
      </footer>
    </main>
  );
}
