import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { s3, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
  audio: 10 * 1024 * 1024, // 10MB
};

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { eventId, fileName, fileType, fileSize, mediaCategory } = body as {
    eventId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    mediaCategory: "image" | "video" | "audio";
  };

  if (!eventId || !fileName || !fileType || !fileSize || !mediaCategory) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedTypes = ALLOWED_TYPES[mediaCategory];
  if (!allowedTypes?.includes(fileType)) {
    return NextResponse.json(
      { error: `Invalid file type: ${fileType}` },
      { status: 400 }
    );
  }

  // Validate file size
  const maxSize = MAX_SIZES[mediaCategory];
  if (fileSize > maxSize) {
    return NextResponse.json(
      {
        error: `File too large. Max ${Math.round(maxSize / 1024 / 1024)}MB`,
      },
      { status: 400 }
    );
  }

  const ext = fileName.split(".").pop() || "bin";
  const key = `events/${eventId}/${mediaCategory}/${Date.now()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({ url, key });
}
