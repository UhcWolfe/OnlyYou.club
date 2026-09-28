import { NextRequest, NextResponse } from "next/server";
import { mockPosts } from "@/lib/api/mock-data";
import { db } from "@/lib/storage/db";
import { Post } from "@/types";
import { notifyRecentPost } from "@/lib/discord/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;
  const creatorId = searchParams.get("creatorId");

  if (creatorId) {
    const posts = db.getCreatorPosts(creatorId);
    return NextResponse.json({
      data: posts.slice(0, limit),
      meta: {
        total: posts.length,
        page: 1,
        limit,
        totalPages: Math.ceil(posts.length / limit) || 1,
      },
    });
  }

  const posts = db.getPosts();
  return NextResponse.json({ data: posts.slice(0, limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Protect official OnlyYou | Club creator from unauthorized posts
    const targetCreatorId = body.creatorId || "creator_default";
    const cleanTargetId = targetCreatorId.toLowerCase().replace(/^(creator_)/, "").replace(/[\s_]+/g, "");
    const isOfficialTarget =
      targetCreatorId === "creator_onlyyou_official" ||
      cleanTargetId === "onlyyou" ||
      cleanTargetId === "onlyyouclub" ||
      cleanTargetId === "onlyyouofficial";

    if (isOfficialTarget) {
      const sessionCookie = request.cookies.get("onlyyou_session")?.value;
      let sessionUser: any = null;
      if (sessionCookie) {
        try {
          let raw = sessionCookie;
          if (raw.startsWith("%7B") || raw.includes("%22")) {
            raw = decodeURIComponent(raw);
          }
          sessionUser = JSON.parse(raw);
        } catch {}
      }

      const isOwner = sessionUser?.id === "1003433567155671183" || sessionUser?.discordId === "1003433567155671183";
      const isAdmin = isOwner || sessionUser?.role === "ADMIN" || (sessionUser?.badges && sessionUser.badges.includes("admin"));

      if (!isAdmin) {
        return NextResponse.json(
          { error: "Publikowanie z oficjalnego konta OnlyYou | Club jest dozwolone wyłącznie dla administratorów." },
          { status: 403 }
        );
      }
    }

    const categories: string[] = Array.isArray(body.categories) && body.categories.length > 0
      ? body.categories
      : body.category ? [body.category] : ["Ogólne"];

    const primaryCategory = categories[0] || "Ogólne";
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newPost: Post = {
      id: postId,
      creatorId: targetCreatorId,
      creator: {
        id: targetCreatorId,
        name: isOfficialTarget ? "OnlyYou | Club" : (body.creatorName || "Twórca"),
        avatarUrl: isOfficialTarget ? "/logo.png" : (body.creatorAvatar || null),
        category: primaryCategory,
        tags: categories,
      },
      channelId: body.channelId || "default",
      title: body.title || null,
      caption: body.caption || "",
      category: primaryCategory,
      categories: categories,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : categories),
      views: 0,
      likes: 0,
      reportsCount: 0,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      media: body.mediaUrl
        ? [
            {
              id: `media_${Date.now()}`,
              postId: postId,
              storageProvider: "LOCAL",
              storageKey: body.mediaUrl,
              cdnUrl: body.mediaUrl,
              originalFilename: body.originalFilename || "film.mp4",
              mimeType: body.mimeType || (body.mediaUrl.endsWith(".mp4") ? "video/mp4" : "image/jpeg"),
              fileSize: body.fileSize || 0,
              width: null,
              height: null,
              thumbnailUrl: body.thumbnailUrl || (body.mimeType?.startsWith("image/") ? body.mediaUrl : null),
              qualities: body.qualities || [],
              transcodingStatus: "COMPLETED",
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
    };

    db.savePost(newPost);
    mockPosts.unshift(newPost);

    // Send Discord discovery notification to 📸・ostatnie
    notifyRecentPost({
      postId: newPost.id,
      title: newPost.title,
      caption: newPost.caption,
      creatorName: newPost.creator.name,
      creatorAvatar: newPost.creator.avatarUrl,
      category: newPost.category,
      tags: newPost.tags,
      mediaUrl: body.mediaUrl,
    }).catch((err) => console.error("Discord discovery notification error:", err));

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć posta" }, { status: 500 });
  }
}
