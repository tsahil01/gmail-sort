"use client";

import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const session =  useSession();
  const [apiKey, setApiKey] = useState<any>("");

  useEffect(()=>{
    if(session.status == "unauthenticated") {
      router.push("/");
      toast({
        title: "You are not logged in",
        description: "Please login to access this page",
      });
    }
    else {
      if(localStorage.getItem("Gemini Key")){
        setApiKey(localStorage.getItem("Gemini Key"));
      } else {
        router.push("/");
        toast({
          title: "API Key not found",
          description: "Please enter your API key to access this page",
        });
      }
    }
  }, [session.status])

  return (
    <main className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950 py-12 px-6 md:px-8">
        
      </div>
      <footer className="bg-zinc-900 text-white py-4 px-6 md:px-8 text-center border-t">
        <p className="text-sm">&copy; 2024 Mail Sorter. All rights reserved.</p>
      </footer>
    </main>
  )
}