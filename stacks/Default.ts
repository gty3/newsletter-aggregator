import { aws_ses, aws_ses_actions } from "aws-cdk-lib"

import {
  Bucket,
  StackContext,
  Table,
  Function,
  Config,
  NextjsSite,
} from "sst/constructs"

export function Default({ stack, app }: StackContext) {
  const EMAIL_DOMAIN = new Config.Parameter(stack, "EMAIL_DOMAIN", {
    value: process.env.EMAIL_DOMAIN,
  })
  const EMAIL_ADDRESS = new Config.Parameter(stack, "EMAIL_ADDRESS", {
    value: process.env.EMAIL_ADDRESS,
  })
  const REGION = new Config.Parameter(stack, "REGION", {
    value: stack.region,
  })

  const bucket = new Bucket(stack, "EmailBucket")

  const userEmailsTable = new Table(stack, "User_EmailArray", {
    fields: {
      pk: "string",
    },
    primaryIndex: { partitionKey: "pk" },
  })

  const newsletterAttributesTable = new Table(stack, "Newsletters_Attributes", {
    fields: {
      pk: "string",
    },
    primaryIndex: { partitionKey: "pk" },
  })

  const sesReceiptFn = new Function(stack, "SesReceiptFn", {
    handler: "functions/sesReceiptFn.handler",
    bind: [userEmailsTable, newsletterAttributesTable],
  })

  sesReceiptFn.attachPermissions(["ses"])

  /* MUST CREATE A GLOBAL RECEIPT RULE SET ONCE AND ACTIVATE IN CONSOLE */
  const receiptRuleSet = aws_ses.ReceiptRuleSet.fromReceiptRuleSetName(
    stack,
    "ReceiptRuleSet",
    "global-receipt-rule-set"
  )
  if (!receiptRuleSet) {
    new aws_ses.ReceiptRuleSet(stack, app.stage + "ReceiptRuleSet", {
      receiptRuleSetName: "global-receipt-rule-set",
    })
  }

  new aws_ses.ReceiptRule(stack, app.stage + "ReceiptRule", {
    ruleSet: receiptRuleSet,
    recipients: [EMAIL_DOMAIN.value],
    actions: [
      new aws_ses_actions.S3({
        bucket: bucket.cdk.bucket,
      }),
      new aws_ses_actions.Lambda({
        function: sesReceiptFn,
      }),
    ],
  })

  const site = new NextjsSite(stack, "site", {
    customDomain: {
      domainName: "emailservice.geoffreyoung.com",
      hostedZone: "geoffreyoung.com",
    },
    bind: [
      bucket,
      userEmailsTable,
      newsletterAttributesTable,
      EMAIL_ADDRESS,
      EMAIL_DOMAIN,
      REGION,
    ],
  })
  /* this ensures [newsletter_id] uses s3 bucket name, bucket name is undefined on initial build */
  site.node.addDependency(bucket)

  bucket.attachPermissions([sesReceiptFn, "ses", site])

  stack.addOutputs({
    SiteUrl: site.url,
  })

  if (app.stage !== "prod") {
    app.setDefaultRemovalPolicy("destroy")
  }
}
