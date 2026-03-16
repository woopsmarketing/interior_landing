import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

function generateToken(): string {
  // Simple HMAC-like token: base64 of secret + timestamp
  const payload = `${ADMIN_SECRET}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    // Token must start with the secret
    return decoded.startsWith(`${ADMIN_SECRET}:`);
  } catch {
    return false;
  }
}

// POST — 로그인
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SECRET) {
      return NextResponse.json(
        { error: "서버 설정 오류" },
        { status: 500 }
      );
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "아이디 또는 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    const token = generateToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24시간
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "로그인 처리 실패" },
      { status: 500 }
    );
  }
}

// GET — 인증 상태 확인
export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

// DELETE — 로그아웃
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
