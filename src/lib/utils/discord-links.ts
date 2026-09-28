import { siteConfig } from "@/config/site";

export function getDiscordHubUrl(channelId?: string | null, guildId?: string): string {
  if (!channelId) {
    return siteConfig.discordInviteUrl;
  }
  const targetGuild = guildId || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "1245000000000000000";
  return `https://discord.com/channels/${targetGuild}/${channelId}`;
}

export function getDiscordMessageUrl(channelId: string, messageId: string, guildId?: string): string {
  const targetGuild = guildId || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "1245000000000000000";
  return `https://discord.com/channels/${targetGuild}/${channelId}/${messageId}`;
}
