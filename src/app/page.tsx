"use client";

import Emails from "@/components/Emails";
import { Login } from "@/components/Login";
import Sessionss from "@/components/Sessionss";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function Home() {

  const { setTheme } = useTheme();
  return <>

    <h1>Helllooo</h1>
    <Button onClick={() => setTheme("light")}>Light</Button>
    <Button onClick={() => setTheme("dark")}>Dark</Button>
    <Button onClick={() => setTheme("system")}>System</Button>
  </>
}







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
