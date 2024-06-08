"use client";

import Emails from "@/components/Emails";
import Header from "@/components/Header";
import { Login } from "@/components/Login";
import HomeMain from "@/components/Main";
import Sessionss from "@/components/Sessionss";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";


export default function Home() {

  return (
    <main className="flex flex-col min-h-screen">
      <Header/>
      <HomeMain/>
      <footer className="bg-gray-900 text-white py-4 px-6 md:px-8 text-center">
        <p className="text-sm">&copy; 2024 Mail Sorter. All rights reserved.</p>
      </footer>
    </main>
  )
}

// export default function Home() {

//   const { setTheme } = useTheme();
//   return <>

//     <h1>Helllooo</h1>
//     <Button onClick={() => setTheme("light")}>Light</Button>
//     <Button onClick={() => setTheme("dark")}>Dark</Button>
//     <Button onClick={() => setTheme("system")}>System</Button>
//   </>
// }







// export default function Home() {
//   return (
//     <>
//     <h1 className="text-3xl">Hello World</h1>
//     <Login/>
//     <Sessionss/>
//     <Emails/>
//     </>
//   );
// }
