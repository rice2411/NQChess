import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client } from "../config/s3.config"

export class S3Service {
  private static BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""

  static async uploadFile(file: File, key: string): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })

    await s3Client.send(command)
    return key
  }

  static async getSignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.BUCKET_NAME,
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
      Bucket: this.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })

    await s3Client.send(command)
    return key
  }
}
