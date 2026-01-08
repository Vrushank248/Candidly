import { Message } from "@/models/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}


/*
This file is written to standardise the Api Response. so that we can share the same properties/parameters in response
*/