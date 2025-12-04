// for future reference, we can refer below docs 
// https://next-auth.js.org/getting-started/typescript

import 'next-auth'
import { DefaultSession } from 'next-auth';

// redefine or modify the interfaces in next auth module or package
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}

// this is another way of modifying only the required part
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;      
    }
}