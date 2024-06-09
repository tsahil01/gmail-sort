import ApiKeyComponent from "@/components/ApiKeyComponent";
import Header from "@/components/Header";
import HomeMain from "@/components/Main";;
import { getServerSession } from "next-auth";


async function getUser() {
  const session = await getServerSession();
  return session;
}


export default async function Home() {
  const session = await getUser();

  return (
    <main className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950 py-12 px-6 md:px-8">
        {session ? <ApiKeyComponent /> : <HomeMain />}
      </div>
      <footer className="bg-zinc-900 text-white py-4 px-6 md:px-8 text-center border-t">
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
