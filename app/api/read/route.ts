
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { Config } from "sst/node/config"
import { Table } from "sst/node/table"

const client = new DynamoDBClient({ region: Config.REGION })

export async function POST(request:Request) {

  const { newsletterId } = await request.json()

  const params = {
    TableName: Table.Newsletters_Attributes.tableName,
    Key: marshall({
      pk: newsletterId,
    }),
    UpdateExpression: 'set #read = :read',
    ExpressionAttributeNames: { '#read': 'read' },
    ExpressionAttributeValues: marshall({ ':read': true }),
  }

  const command = new UpdateItemCommand(params)
  try {
    const res = await client.send(command)
    return new Response(JSON.stringify({ statusCode: 200, body: res }))
  } catch (err) {
    console.error(err)
  }
}
