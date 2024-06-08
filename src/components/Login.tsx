"use client";

import { signIn, signOut } from "next-auth/react"

export function Login(){
    return (
        <div className="p-9 border border-black">
            <h1>Login</h1>

            <button className="border border-black" onClick={async()=>{
                signIn("google")
            }}>Login with Google</button>

<button className=" border border-black" onClick={async()=>{
                signOut()
            }}>Logout</button>
        </div>
    )
}