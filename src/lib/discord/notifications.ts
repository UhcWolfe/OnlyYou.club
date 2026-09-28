/**
 * OnlyYou Discord Discovery Notifications
 * Bridges Website discovery events to Discord channels:
 * - 🔥 Na Czasie -> Discord: 🔥・trending
 * - 🆕 Nowi Twórcy -> Discord: 🆕・nowi-twórcy
 * - 📸 Ostatnie Posty -> Discord: 📸・ostatnie
 * - ⭐ Rekomendowani Twórcy -> Discord: ⭐・polecani
 */

export interface RecentPostPayload {
  postId: string;
  title?: string | null;
  caption?: string | null;
  creatorName: string;
  creatorAvatar?: string | null;
  category?: string | null;
  tags?: string[];
  mediaUrl?: string | null;
}

export interface NewCreatorPayload {
  name: string;
  category?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface TrendingPayload {
  name: string;
  title?: string | null;
  views?: number;
  likes?: number;
  score?: number;
  postId?: string;
  avatarUrl?: string | null;
}

export interface FeaturedCreatorPayload {
  name: string;
  category?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

const DEFAULT_SECRET = process.env.DISCORD_WEBHOOK_SECRET || "";
const DEFAULT_DISCORD_TOKEN =
  process.env.DISCORD_TOKEN ||
  process.env.DISCORD_BOT_TOKEN ||
  "";
const DEFAULT_GUILD_ID =
  process.env.DISCORD_GUILD_ID || "";

// In-memory cache for channel IDs
const channelIdCache = new Map<string, string>();

async function sendToBotApi(
  type: "recent_posts" | "new_creators" | "trending" | "featured",
  data: any
): Promise<boolean> {
  const apiUrl =
    process.env.ONLYYOU_API_URL?.replace(/\/+$/, "") ||
    "http://127.0.0.1:3000/api/v1";
  const apiSecret =
    process.env.ONLYYOU_API_SECRET || process.env.API_SECRET || DEFAULT_SECRET;

  try {
    const res = await fetch(`${apiUrl}/discovery/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiSecret}`,
      },
      body: JSON.stringify({ type, data }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      return true;
    }
  } catch {
    // Bot Fastify API may be offline or port is different
  }
  return false;
}

async function resolveDiscordChannelId(
  type: "recent_posts" | "new_creators" | "trending" | "featured"
): Promise<string | null> {
  // Check env direct overrides
  if (type === "recent_posts" && process.env.DISCORD_CHANNEL_RECENT_POSTS_ID) {
    return process.env.DISCORD_CHANNEL_RECENT_POSTS_ID;
  }
  if (type === "new_creators" && process.env.DISCORD_CHANNEL_NEW_CREATORS_ID) {
    return process.env.DISCORD_CHANNEL_NEW_CREATORS_ID;
  }
  if (type === "trending" && process.env.DISCORD_CHANNEL_TRENDING_ID) {
    return process.env.DISCORD_CHANNEL_TRENDING_ID;
  }
  if (type === "featured" && process.env.DISCORD_CHANNEL_FEATURED_CREATORS_ID) {
    return process.env.DISCORD_CHANNEL_FEATURED_CREATORS_ID;
  }

  // Check cache
  if (channelIdCache.has(type)) {
    return channelIdCache.get(type)!;
  }

  // Fetch guild channels from Discord REST API
  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${DEFAULT_GUILD_ID}/channels`,
      {
        headers: {
          Authorization: `Bot ${DEFAULT_DISCORD_TOKEN}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (res.ok) {
      const channels: any[] = await res.json();
      const textChannels = channels.filter((c) => c.type === 0);

      const patterns: Record<string, string[]> = {
        recent_posts: ["ostatnie", "posty"],
        new_creators: ["nowi-twórcy", "nowi-tworcy", "nowi"],
        trending: ["trending"],
        featured: ["polecani", "rekomendowani"],
      };

      for (const [key, searchList] of Object.entries(patterns)) {
        const found = textChannels.find((c) =>
          searchList.some((pat) => c.name.toLowerCase().includes(pat))
        );
        if (found) {
          channelIdCache.set(key, found.id);
        }
      }

      if (channelIdCache.has(type)) {
        return channelIdCache.get(type)!;
      }
    }
  } catch (err) {
    console.warn("[Discord API] Failed to resolve channel ID directly:", err);
  }

  return null;
}

async function sendDirectDiscordRest(
  channelId: string,
  embed: any,
  components: any[] = []
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${DEFAULT_DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
          components: components.length ? components : undefined,
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    return res.ok;
  } catch (err) {
    console.error("[Discord REST API] Failed to post message directly:", err);
    return false;
  }
}

export async function notifyRecentPost(
  payload: RecentPostPayload
): Promise<boolean> {
  // 1. Try bot Fastify API
  const viaBot = await sendToBotApi("recent_posts", payload);
  if (viaBot) return true;

  // 2. Direct Discord REST API fallback
  const channelId = await resolveDiscordChannelId("recent_posts");
  if (!channelId) return false;

  const postTitle =
    payload.title || payload.caption || "Nowa publikacja na OnlyYou";
  const cleanCategory = payload.category || "Ogólne";
  const tagsString =
    payload.tags && payload.tags.length
      ? payload.tags
          .map((t) => (t.startsWith("#") ? t : `#${t}`))
          .join(" ")
      : `#${cleanCategory.toLowerCase().replace(/[\s_]+/g, "")}`;

  const embed: any = {
    title: `📸 Nowy post od ${payload.creatorName}!`,
    description:
      `**${postTitle}**\n\n` +
      `👤 **Twórca:** [${payload.creatorName}](https://onlyyouhub.com/creator/${encodeURIComponent(payload.creatorName)})\n` +
      `📁 **Kategoria:** \`${cleanCategory}\`\n` +
      `🏷️ **Tagi:** ${tagsString}\n\n` +
      `🔗 Kliknij poniższy przycisk, aby obejrzeć na **OnlyYouHub.com**!`,
    color: 0xec4899,
    footer: { text: "OnlyYou • 📸 Ostatnie Posty" },
    timestamp: new Date().toISOString(),
  };

  if (payload.creatorAvatar) {
    embed.thumbnail = { url: payload.creatorAvatar };
  }

  const components = [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: "▶️ Oglądaj na OnlyYou",
          url: `https://onlyyouhub.com/post/${payload.postId}`,
        },
        {
          type: 2,
          style: 5,
          label: "👤 Profil Twórcy",
          url: `https://onlyyouhub.com/creator/${encodeURIComponent(payload.creatorName)}`,
        },
      ],
    },
  ];

  return sendDirectDiscordRest(channelId, embed, components);
}

export async function notifyNewCreator(
  payload: NewCreatorPayload
): Promise<boolean> {
  const viaBot = await sendToBotApi("new_creators", payload);
  if (viaBot) return true;

  const channelId = await resolveDiscordChannelId("new_creators");
  if (!channelId) return false;

  const embed: any = {
    title: `🆕 Nowy Twórca w OnlyYou: ${payload.name}!`,
    description:
      `Do oficjalnej społeczności twórców OnlyYou dołączył(a) **${payload.name}**! 🎉\n\n` +
      `📌 **Główna kategoria:** \`${payload.category || "Ogólne"}\`\n` +
      (payload.bio ? `📝 **O mnie:**\n> ${payload.bio}\n\n` : "\n") +
      `Odwiedź profil, zobacz pierwsze publikacje i zaobserwuj twórcę!`,
    color: 0x22c55e,
    footer: { text: "OnlyYou • 🆕 Nowi Twórcy" },
    timestamp: new Date().toISOString(),
  };

  if (payload.avatarUrl) {
    embed.thumbnail = { url: payload.avatarUrl };
  }

  const components = [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: "✨ Odwiedź profil Twórcy",
          url: `https://onlyyouhub.com/creator/${encodeURIComponent(payload.name)}`,
        },
      ],
    },
  ];

  return sendDirectDiscordRest(channelId, embed, components);
}

export async function notifyTrending(
  payload: TrendingPayload
): Promise<boolean> {
  const viaBot = await sendToBotApi("trending", payload);
  if (viaBot) return true;

  const channelId = await resolveDiscordChannelId("trending");
  if (!channelId) return false;

  const embed: any = {
    title: `🔥 Na Czasie: ${payload.name}!`,
    description:
      `Twórca **${payload.name}** bije rekordy popularności i właśnie trafił do sekcji **Na Czasie**! 🔥\n\n` +
      (payload.title ? `📌 **Wyróżniony materiał:** *${payload.title}*\n` : "") +
      `👀 **Wyświetlenia:** \`${payload.views || 0}\`  |  ❤️ **Polubienia:** \`${payload.likes || 0}\`\n\n` +
      `Sprawdź najgorętsze trendy i odkrywaj najpopularniejszych twórców na OnlyYou!`,
    color: 0xf59e0b,
    footer: { text: "OnlyYou • 🔥 Na Czasie" },
    timestamp: new Date().toISOString(),
  };

  if (payload.avatarUrl) {
    embed.thumbnail = { url: payload.avatarUrl };
  }

  const components = [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: "🔥 Zobacz Trending na stronie",
          url: "https://onlyyouhub.com/trending",
        },
        {
          type: 2,
          style: 5,
          label: "👤 Profil Twórcy",
          url: `https://onlyyouhub.com/creator/${encodeURIComponent(payload.name)}`,
        },
      ],
    },
  ];

  return sendDirectDiscordRest(channelId, embed, components);
}

export async function notifyFeaturedCreator(
  payload: FeaturedCreatorPayload
): Promise<boolean> {
  const viaBot = await sendToBotApi("featured", payload);
  if (viaBot) return true;

  const channelId = await resolveDiscordChannelId("featured");
  if (!channelId) return false;

  const embed: any = {
    title: `⭐ Rekomendowany Twórca: ${payload.name}!`,
    description:
      `Poznaj polecanego twórcę OnlyYou: **${payload.name}**! ⭐\n\n` +
      `📌 **Kategoria:** \`${payload.category || "Ogólne"}\`\n` +
      (payload.bio ? `📝 **Opis twórcy:**\n> ${payload.bio}\n\n` : "\n") +
      `Zajrzyj na profil, oceń twórczość i zostaw polubienie!`,
    color: 0xeab308,
    footer: { text: "OnlyYou • ⭐ Rekomendowani Twórcy" },
    timestamp: new Date().toISOString(),
  };

  if (payload.avatarUrl) {
    embed.thumbnail = { url: payload.avatarUrl };
  }

  const components = [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: "⭐ Zobacz profil Twórcy",
          url: `https://onlyyouhub.com/creator/${encodeURIComponent(payload.name)}`,
        },
      ],
    },
  ];

  return sendDirectDiscordRest(channelId, embed, components);
}
