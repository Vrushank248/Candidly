// NOTE: IN NEW VERSION OF NEXT.JS THE MIDDLEWARE IS RENAMED TO PROXY

// Always keep the middleware file in the root folder
// that is src if exist else root folder
// code ref: https://nextjs.org/docs/app/getting-started/proxy
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export {default} from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const token = await getToken({req: request})
  const url = request.nextUrl
  // if user have token then directly go to dashboard
  if(token && 
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname.startsWith('/')
    )
  ){
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
// See "Matching Paths" below to learn more
// these are the paths where we want to run our middleware
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*', // /:path* means we want to run middleware on all paths following /dashboard
    '/verify/:path*',

  ]
}