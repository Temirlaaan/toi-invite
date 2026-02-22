const s3Endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
const s3Bucket = process.env.S3_BUCKET || "toi-invite";

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If src is already a full URL, return as-is with width param
  if (src.startsWith("http")) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  // Otherwise, construct MinIO URL from S3 key
  return `${s3Endpoint}/${s3Bucket}/${src}`;
}
