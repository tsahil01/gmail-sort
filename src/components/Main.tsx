import { ChromeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function HomeMain() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 py-12 px-6 md:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                        Streamline Your Mail Sorting
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Our powerful mail sorting application helps you stay organized and efficient. Automatically categorize and
                        prioritize your incoming mail with ease.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button onClick={()=>signIn("google")}>
                        <ChromeIcon className="mr-2 h-5 w-5" />
                        Login with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}
