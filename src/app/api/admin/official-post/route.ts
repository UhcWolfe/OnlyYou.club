import { NextRequest, NextResponse } from "next/server";
import { db, OFFICIAL_ONLYYOU_CREATOR } from "@/lib/storage/db";
import { Post, User } from "@/types";
import { notifyRecentPost } from "@/lib/discord/notifications";

export const dynamic = "force-dynamic";

function getAuthenticatedAdmin(request: NextRequest): User | null {
  const sessionCookie = request.cookies.get("onlyyou_session")?.value;
  if (!sessionCookie) return null;

  try {
    let raw = sessionCookie;
    if (raw.startsWith("%7B") || raw.includes("%22")) {
      raw = decodeURIComponent(raw);
    }
    const user = JSON.parse(raw) as User;
    const isOwner = user.id === "1003433567155671183" || user.discordId === "1003433567155671183";
    const isAdmin = isOwner || user.role === "ADMIN" || (user.badges && user.badges.includes("admin"));
    return isAdmin ? user : null;
  } catch {
    return null;
  }
}

// GET /api/admin/official-post - List official OnlyYou posts
export async function GET(request: NextRequest) {
  const admin = getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const posts = db.getCreatorPosts("creator_onlyyou_official");
  return NextResponse.json({
    success: true,
    data: posts,
    creator: OFFICIAL_ONLYYOU_CREATOR,
  });
}

// POST /api/admin/official-post - Publish a video as OnlyYou | Club
export async function POST(request: NextRequest) {
  const admin = getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Tytuł filmu jest wymagany" }, { status: 400 });
    }

    if (!body.mediaUrl) {
      return NextResponse.json({ error: "Wideo jest wymagane" }, { status: 400 });
    }

    const categories: string[] =
      Array.isArray(body.categories) && body.categories.length > 0
        ? body.categories
        : body.category
        ? [body.category]
        : ["Ogólne"];

    const primaryCategory = categories[0] || "Ogólne";
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const tags: string[] = Array.isArray(body.tags) && body.tags.length > 0
      ? body.tags
      : ["official", "onlyyou", primaryCategory];

    const newPost: Post = {
      id: postId,
      creatorId: "creator_onlyyou_official",
      creator: {
        id: "creator_onlyyou_official",
        name: "OnlyYou | Club",
        avatarUrl: "/logo.png",
        category: primaryCategory,
        tags: ["official", "onlyyou", ...categories],
      },
      channelId: "official",
      title: body.title.trim(),
      caption: (body.caption || body.title).trim(),
      category: primaryCategory,
      categories: categories,
      tags: tags,
      views: 0,
      likes: 0,
      reportsCount: 0,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      media: [
        {
          id: `media_${Date.now()}`,
          postId: postId,
          storageProvider: "LOCAL",
          storageKey: body.mediaUrl,
          cdnUrl: body.mediaUrl,
          originalFilename: body.originalFilename || "film.mp4",
          mimeType: body.mimeType || "video/mp4",
          fileSize: body.fileSize || 0,
          width: 1920,
          height: 1080,
          thumbnailUrl: body.thumbnailUrl || null,
          qualities: body.qualities || [{ label: "1080p", height: 1080, width: 1920, url: body.mediaUrl }],
          transcodingStatus: "COMPLETED",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    db.savePost(newPost);

    // Send Discord discovery notification to 📸・ostatnie as OnlyYou | Club
    notifyRecentPost({
      postId: newPost.id,
      title: newPost.title,
      caption: newPost.caption,
      creatorName: "OnlyYou | Club",
      creatorAvatar: "https://onlyyouhub.com/logo.png",
      category: newPost.category,
      tags: newPost.tags,
      mediaUrl: body.mediaUrl,
    }).catch((err) => console.error("Discord discovery notification error for official post:", err));

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Failed to publish official post:", error);
    return NextResponse.json({ error: "Nie udało się opublikować filmu" }, { status: 500 });
  }
}

// DELETE /api/admin/official-post - Remove an official post
export async function DELETE(request: NextRequest) {
  const admin = getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const deleted = db.deletePost(postId);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Film został pomyślnie usunięty",
    });
  } catch (error) {
    console.error("Failed to delete official post:", error);
    return NextResponse.json({ error: "Nie udało się usunąć filmu" }, { status: 500 });
  }
}
