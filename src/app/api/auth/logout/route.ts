import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/auth/get-app-url";

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl(request);
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = rawHost.split(",")[0].trim();
  const cookieDomain = host.includes("onlyyouhub.com")
    ? ".onlyyouhub.com"
    : host.includes("onlyyou.club")
    ? ".onlyyou.club"
    : undefined;

  const response = NextResponse.redirect(`${appUrl}/`);
  response.cookies.delete("onlyyou_session");
  response.cookies.set("onlyyou_session", "", {
    path: "/",
    maxAge: 0,
  });
  if (cookieDomain) {
    response.cookies.set("onlyyou_session", "", {
      path: "/",
      domain: cookieDomain,
      maxAge: 0,
    });
  }
  return response;
}
