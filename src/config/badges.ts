export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export const AVAILABLE_BADGES: Record<string, BadgeDefinition> = {
  creator: {
    id: "creator",
    name: "Twórca",
    description: "Oficjalny, zweryfikowany twórca w programie OnlyYou",
    iconUrl: "/badges/creator.webp",
  },
  admin: {
    id: "admin",
    name: "Administrator",
    description: "Członek zespołu administracji OnlyYou",
    iconUrl: "/badges/admin.webp",
  },
};

// Known admin & creator Discord IDs and identifiers
export const ADMIN_DISCORD_IDS = ["1003433567155671183"];
export const CREATOR_DISCORD_IDS = ["1003433567155671183"];
const ADMIN_IDENTIFIERS = ["uhcwolfe", "admin", "owner", "onlyyou"];

export function isUserAdmin(
  user?: { username?: string; discordId?: string; badges?: string[]; role?: string } | null
): boolean {
  if (!user) return false;
  if (user.badges && user.badges.includes("admin")) return true;
  if (user.role === "ADMIN") return true;
  return false;
}

export function isUserCreator(
  user?: { username?: string; discordId?: string; badges?: string[]; creator?: any } | null,
  isCreatorParam?: boolean
): boolean {
  if (isCreatorParam !== undefined) return isCreatorParam;
  if (!user) return false;
  if (user.badges && user.badges.includes("creator")) return true;
  return false;
}

export function resolveUserBadges(
  user?: { username?: string; discordId?: string; badges?: string[]; role?: string } | null,
  isCreator?: boolean
): BadgeDefinition[] {
  const result: BadgeDefinition[] = [];

  const hasCreator = isUserCreator(user, isCreator);
  if (hasCreator) {
    result.push(AVAILABLE_BADGES.creator);
  }

  const hasAdmin = isUserAdmin(user);
  if (hasAdmin) {
    result.push(AVAILABLE_BADGES.admin);
  }

  return result;
}

export function hasAdminBadge(
  user?: { username?: string; discordId?: string; badges?: string[]; role?: string } | null
): boolean {
  return isUserAdmin(user);
}

