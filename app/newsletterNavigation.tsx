// "use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { Config } from "sst/node/config"
import { Table } from "sst/node/table"

type UserAndNewsletters = {
  pk: string
  newsletterArray: string[]
}

type Newsletter = {
  subject: string
  date: string
  id: string
  read?: boolean
}
type NewsletterAttributes = Newsletter & {
  from: string
}

type OrganizedNewsletters = {
  [from: string]: Newsletter[]
}

const client = new DynamoDBClient({ region: Config.REGION })

const NewsletterNavigation = async () => {
  const { Item } = await newsletterRes()
  if (!Item) return
  const { newsletterArray } = unmarshall(Item) as UserAndNewsletters
  const newsletterMap = await arrangeNewsletters(newsletterArray)

  return (
    <Accordion type="single" collapsible className="px-4  flex flex-col">
      <Link className="py-4" href="/">
        Home
      </Link>
      <hr />
      {Object.entries(newsletterMap).map(([name, array]) => (
        <AccordionItem key={name} value={name}>
          <AccordionTrigger>{name}</AccordionTrigger>
          {array.map((newsletter) => (
            <AccordionContent key={newsletter.id} className={newsletter.read ? "bg-gray-200" : ""}>
              <Link className="" href={newsletter.id}>
                {newsletter.subject}
              </Link>
            </AccordionContent>
          ))}
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const newsletterRes = async (): Promise<any> => {
  const params = {
    TableName: Table.User_EmailArray.tableName,
    Key: marshall({
      pk: Config.EMAIL_ADDRESS,
    }),
  }
  const command = new GetItemCommand(params)
  try {
    return await client.send(command)
  } catch (err) {
    console.error(err)
  }
}

const getNewsletterAttributes = async (newsletterId: string) => {
  const params = {
    TableName: Table.Newsletters_Attributes.tableName,
    Key: marshall({
      pk: newsletterId,
    }),
  }
  const command = new GetItemCommand(params)
  try {
    return await client.send(command)
  } catch (err) {
    return { Item: null }
  }
}

const extractName = (input: string): string => {
  const match = input.match(/[^<]*/)
  return match ? match[0].trim() : ""
}

const arrangeNewsletters = async (
  newsletterArray: string[]
): Promise<OrganizedNewsletters> => {
  return await newsletterArray.reduce(async (accPromise, id) => {
    const acc = await accPromise
    const { Item } = (await getNewsletterAttributes(id)) || {}
    if (!Item) return acc
    const { subject, from, date, read } = unmarshall(Item) as NewsletterAttributes
    const name = extractName(from || "")
    acc[name] = acc[name] || []
    acc[name].push({ subject, date, id, read })
    return acc
  }, Promise.resolve({} as OrganizedNewsletters))
}

export default NewsletterNavigation
