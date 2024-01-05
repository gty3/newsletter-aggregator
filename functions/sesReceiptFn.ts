import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { SESEvent, SESMail } from "aws-lambda"
import { Table } from "sst/node/table"

const dynamoDBclient = new DynamoDBClient({ region: "us-east-1" }) // as NodeJsClient<DynamoDBClient>

export const handler = async (event: SESEvent): Promise<void> => {
  const { Records } = event
  const sesRecord = Records && Records[0] && Records[0].ses
  if (!sesRecord) {
    console.error("Not an SES event")
    return
  }
  try {
    await Promise.all([
      updateUsersNewsletters(sesRecord.mail),
      updateNewsletterAttributes(sesRecord.mail),
    ])
  } catch (err) {
    console.log(err)
  }
}

const updateUsersNewsletters = async (emailRecord: SESMail): Promise<void> => {
  const { messageId, destination } = emailRecord
  const recipient = destination[0]

  try {
    const updateParams = {
      TableName: Table.User_EmailArray.tableName,
      Key: {
        pk: { S: recipient },
      },
      ExpressionAttributeNames: {
        "#NA": "newsletterArray",
      },
      ExpressionAttributeValues: {
        ":newNewsletterArray": { L: [{ S: messageId }] },
        ":emptyList": { L: [] },
      },
      UpdateExpression:
        "SET #NA = list_append(if_not_exists(#NA, :emptyList), :newNewsletterArray)",
    }
    console.log("updateParams", updateParams)
    const updateCommand = new UpdateItemCommand(updateParams)
    const res = await dynamoDBclient.send(updateCommand)
    console.log("RESSSSSSSSSSSSSSSSSSS", res)
  } catch (error) {
    console.log("error", error)
    throw new Error("error updating user's newsletters" + error)
  }
}

const updateNewsletterAttributes = async (emailRecord: SESMail) => {
  const { messageId, commonHeaders } = emailRecord
  const { date, from, subject } = commonHeaders

  try {
    const updateParams = {
      TableName: Table.Newsletters_Attributes.tableName,
      Key: {
        pk: { S: messageId },
      },
      ExpressionAttributeNames: {
        "#DA": "date",
        "#FR": "from",
        "#SU": "subject",
      },
      ExpressionAttributeValues: {
        ":date": { S: date },
        ":from": { S: from?.[0] || "" },
        ":subject": { S: subject || "" },
      },
      UpdateExpression: "SET #DA = :date, #FR = :from, #SU = :subject",
    }
    console.log("updateParams", updateParams)
    const updateCommand = new UpdateItemCommand(updateParams)
    const res = await dynamoDBclient.send(updateCommand)
    console.log("RESSSSSSSSSSSSSSSSSSS", res)
  } catch (error) {
    console.log("error", error)
    throw new Error("error updating user's newsletters" + error)
  }
}
