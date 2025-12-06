import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    // If no token, just send user to the accept page
    if (!token) {
      return NextResponse.redirect(new URL('/invite/accept', url));
    }

    const redirectUrl = new URL('/invite/accept', url);
    // keep token in query for immediate handling
    redirectUrl.searchParams.set('token', token);

    const res = NextResponse.redirect(redirectUrl);
    // set an httpOnly cookie so that after sign-in the client can use it
    res.cookies.set('pendingInviteToken', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7 days
    return res;
  } catch (err) {
    console.error('invite redirect error', err);
    return NextResponse.redirect(new URL('/invite/accept', req.url));
  }
}
