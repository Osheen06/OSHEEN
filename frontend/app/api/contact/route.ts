import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  intent?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;

  if (!body.name || !body.email || !body.message || body.message.length < 10) {
    return NextResponse.json({ message: "Please include a name, email, and a real note." }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Message received. Osheen will reply with sparkle and specifics.",
      lead: {
        ...body,
        id: `lead-web-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    },
    { status: 201 }
  );
}
