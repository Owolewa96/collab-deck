
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Enter Email" },
        { status: 400 }
      );
    }

    // Dynamic import to avoid model re-compilation issues
    const User = (await import("@/models/User")).default as any;

    const user = await User.findOne({ email })
      .select("_id name email")
      .lean();

    if (!user) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        exists: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHECK USER EXISTS ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
