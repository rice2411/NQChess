import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  s3Client,
  S3_BUCKET_NAME,
  S3_BUCKET_REGION,
} from "@/core/config/s3.config"
import { v4 as uuidv4 } from "uuid"

export interface IUploadFileResponse {
  key: string
  url: string
}

export interface IS3Object {
  key: string
  url: string
  lastModified: Date
  size: number
}

export class S3Service {
  static async uploadFile(
    file: File,
    folder: string = "uploads"
  ): Promise<IUploadFileResponse> {
    const key = `${folder}/${uuidv4()}-${file.name}`
    console.log("Uploading file to S3:", {
      bucket: S3_BUCKET_NAME,
      key,
      contentType: file.type,
      size: file.size,
    })

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: file.type,
      Body: file,
    })

    await s3Client.send(command)

    const url = `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${key}`
    console.log("File uploaded successfully:", { key, url })

    return { key, url }
  }

  static async getSignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  }

  static async uploadBase64(
    base64: string,
    key: string,
    contentType: string
  ): Promise<string> {
    const buffer = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    )

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })

    await s3Client.send(command)
    return key
  }

  static async listFiles(folder: string = ""): Promise<IS3Object[]> {
    console.log("Listing files from S3:", {
      bucket: S3_BUCKET_NAME,
      region: S3_BUCKET_REGION,
      folder,
    })

    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Prefix: folder,
    })

    try {
      const response = await s3Client.send(command)
      console.log("S3 ListObjects response:", {
        keyCount: response.KeyCount,
        isTruncated: response.IsTruncated,
        contents: response.Contents?.map((c) => ({
          key: c.Key,
          size: c.Size,
          lastModified: c.LastModified,
        })),
      })

      if (!response.Contents) {
        console.log("No contents found in bucket")
        return []
      }

      const files = response.Contents.map((object) => ({
        key: object.Key || "",
        url: `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${object.Key}`,
        lastModified: object.LastModified || new Date(),
        size: object.Size || 0,
      }))

      console.log("Mapped files:", files)
      return files
    } catch (error) {
      console.error("Error listing files from S3:", error)
      throw error
    }
  }

  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }

  static async deleteFiles(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteFile(key)))
  }
}
