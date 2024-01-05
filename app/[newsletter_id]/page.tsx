import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  _Object,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3"
import { NodeJsClient } from "@smithy/types"
import { simpleParser } from "mailparser"
import { Bucket } from "sst/node/bucket"
import { sanitize } from "isomorphic-dompurify"
import Client from "./client"


const s3Client = new S3Client({ region: "us-east-1" }) as NodeJsClient<S3Client>

export const generateStaticParams = async () => {
  const data = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: Bucket.EmailBucket.bucketName,
    })
  )

  let paths: { params: { slug: string } }[] = []
  if (data.Contents) {
    paths = data.Contents.map((file) => ({
      params: { slug: file.Key as string },
    }))
  }
  return paths
}

export default async function NewsletterPage({
  params,
}: {
  params: { newsletter_id: string }
}) {

  const { newsletter_id } = params

  const emailData: GetObjectCommandOutput = await s3Client.send(
    new GetObjectCommand({
      Bucket: Bucket.EmailBucket.bucketName,
      Key: newsletter_id,
    })
  )

  if (!emailData.Body) {
    return { notFound: true }
  }

  const emailString = await emailData.Body.transformToString()
  const { html } = await simpleParser(emailString)
  const cleanHtml = sanitize("" + html)
  
    return (
      <>
        <Client newsletterId={newsletter_id} />
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
      </>
    )
}