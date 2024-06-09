"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {  useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export default function ApiKeyComponent() {
    const [apiKey, setApiKey] = useState("");
    const [selectedProvider, setSelectedProvider] = useState("");
    const { toast } = useToast()
    const router = useRouter();

    return (
        <div className="mx-auto max-w-md space-y-6 py-12">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Enter Your API Key</h1>
                <p className="text-gray-500 dark:text-gray-400">Provide your API key to access our platform's features.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>API Key</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Select onValueChange={(e)=>setSelectedProvider(e)}>
                                        <SelectTrigger id="apiKey">
                                            <SelectValue placeholder="API Key Provider" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="Gemini">Gemini</SelectItem>
                                            <SelectItem value="GPT">Chat GPT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                        <Input id="api-key" type="text" placeholder="Enter your API key" required autoComplete="off" onChange={(e) => setApiKey(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" className="w-full" onClick={
                        () => { 
                            if (selectedProvider === "" || apiKey === "") {
                                toast({
                                    title: "API Key Error",
                                    description: "Please select a provider and enter your API key.",
                                  })
                                return
                            }
                            localStorage.setItem(`${selectedProvider} Key`, apiKey)
                            toast({
                                title: "API Key Saved",
                                description: "Your API key has been saved successfully.",
                              })
                            router.push("/mails")
                            }
                        }>
                        Save API Key
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
