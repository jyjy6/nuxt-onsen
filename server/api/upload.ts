// server/api/upload.ts - 대용량 파일 처리 최적화
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { defineEventHandler, readBody } from "h3";
// 파일 타입에 따른 Content-Type 매핑 (필요시 확장)
const getMimeType = (fileType: string) => {
  const mimeTypes: Record<string, string> = {
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/gif": "image/gif",
    "image/webp": "image/webp",
    "video/mp4": "video/mp4",
    "video/webm": "video/webm",
    "audio/mpeg": "audio/mpeg",
    "audio/wav": "audio/wav",
    "audio/ogg": "audio/ogg",
  };

  return mimeTypes[fileType] || fileType || "application/octet-stream";
};

export default defineEventHandler(async (event) => {
  try {
    if (
      !process.env.S3_REGION ||
      !process.env.S3_KEY ||
      !process.env.S3_SECRET
    ) {
      throw new Error("Missing required S3 environment variables");
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
      },
    });

    const body = await readBody(event);
    const { file, filename, contentType } = body;

    // 파일 크기 제한 (필요시 조정)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    // base64 디코딩
    const fileData = file.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(fileData, "base64");

    // 파일 크기 검사
    if (buffer.length > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `파일 크기가 너무 큽니다. 최대 ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB까지 가능합니다.`,
      };
    }

    // 파일 확장자 추출 및 고유 파일명 생성
    const fileExtension = filename.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExtension}`;

    // 폴더 구조 생성 (파일 타입별로 분류)
    let folderPrefix = "";
    if (contentType.startsWith("image/")) {
      folderPrefix = "images/";
    } else if (contentType.startsWith("video/")) {
      folderPrefix = "videos/";
    } else if (contentType.startsWith("audio/")) {
      folderPrefix = "audios/";
    } else {
      folderPrefix = "files/";
    }

    const s3Key = `${folderPrefix}${uniqueFileName}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: getMimeType(contentType),
        ContentDisposition: `inline; filename="${filename}"`,
        // ACL: "public-read", // 필요에 따라 접근 권한 설정
      },
      // 청크 단위로 분할 업로드 (대용량 파일용)
      partSize: 5 * 1024 * 1024, // 각 파트 5MB
      leavePartsOnError: false, // 에러 발생 시 업로드된 부분 삭제
    });

    const result = await upload.done();

    return {
      success: true,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
      key: s3Key,
      fileType: contentType.split("/")[0], // image, video, audio 등
      fileSize: buffer.length,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
