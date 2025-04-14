import { S3Client } from "@aws-sdk/client-s3"

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("Missing AWS_ACCESS_KEY_ID")
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS_SECRET_ACCESS_KEY")
}

if (!process.env.AWS_REGION) {
  throw new Error("Missing AWS_REGION")
}

if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error("Missing AWS_S3_BUCKET_NAME")
}

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
export const S3_BUCKET_REGION = process.env.AWS_REGION

// Tạo credentials object với đầy đủ thông tin
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // Thêm sessionToken nếu sử dụng temporary credentials
  // sessionToken: process.env.AWS_SESSION_TOKEN
}

export const s3Client = new S3Client({
  region: S3_BUCKET_REGION,
  credentials,
  // Sử dụng endpoint mặc định của AWS
  // Không cần chỉ định endpoint cụ thể
})
