"use client";

import { useSession } from "next-auth/react";

export default function Sessionss() {
    const session = useSession();
  return (
    <div className="p-9 border border-black">
      <h1 className="text-3xl">Sessions</h1>
        <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}