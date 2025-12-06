import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ message: 'Signed out' }, { status: 200 });

    // Clear the auth cookie
    // Set cookie with Max-Age=0 to expire it
    res.headers.set('Set-Cookie', 'authToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict;');

    return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Signout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
