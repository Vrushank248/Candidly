'use client'; // ref : https://react.dev/reference/rsc/use-client
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
    children,
}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
       {children} 
    </SessionProvider>
  )
}