import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll("onlyyou_session");

  if (!allCookies || allCookies.length === 0) {
    redirect("/login");
  }

  let sessionUser: User | null = null;
  for (const c of allCookies) {
    try {
      let raw = c.value;
      if (raw.startsWith("%7B") || raw.includes("%22") || raw.includes("%")) {
        try {
          raw = decodeURIComponent(raw);
        } catch {}
      }
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.username || parsed.id)) {
        sessionUser = parsed;
        break;
      }
    } catch {}
  }

  if (sessionUser?.username) {
    redirect(`/${encodeURIComponent(sessionUser.username.toLowerCase())}`);
  }

  redirect("/login");
}
