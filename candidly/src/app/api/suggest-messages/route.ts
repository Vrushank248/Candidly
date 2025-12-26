import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {

    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. \
        Each question should be separated by '||'. These questions are for an anonymous socia; messaging platform, \
        like Qooh.me and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing \
        instead on universal themes that encourage friendly interaction. For example, your output should be structured \
        like this: 'Whats a hobby you have recently started? || If you could have dinner with any historical figure, who would \
        it be? || Whats a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute \
        to a positive and welcoming conversational environment."

  const messages: UIMessage[] = [
    {
      id: crypto.randomUUID(),  // unique ID
      role: "user",             // user role
      parts: [
        {
          type: "text",
          text: prompt,         // your custom prompt text
        },
      ],
    },
  ];

  const result = streamText({
    model: "xai/grok-4",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
    } catch (error) {
            console.log("An unexpected error occured ", error)
            throw error
    }
}