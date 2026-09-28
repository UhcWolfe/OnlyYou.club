import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/auth/get-app-url";

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const appUrl = getAppUrl(request);
  const redirectUri = encodeURIComponent(`${appUrl}/api/auth/callback`);

  if (!clientId) {
    return NextResponse.json(
      { error: "DISCORD_CLIENT_ID is not configured in .env" },
      { status: 500 }
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;

  return NextResponse.redirect(discordAuthUrl);
}
