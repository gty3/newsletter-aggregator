This is an email aggregator built with SST, Nextjs, Tailwind, Shadcn
Having trouble? Contact me - https://discordapp.com/users/456993274201112577

Requirements: AWS account
See: https://docs.sst.dev/setting-up-aws




1.
Rename .env.example to .env

2.
Create a domain / connect with AWS SES



MUST SET UP ROUTE 53 HOTED ZONE / SES MAILER

Set region in sst.config.ts, default is us-east-1

for front end development:
`pnpm i`
`pnpm dev`

to deploy:
`npx sst deploy`

You will need to activate your SES Reciept rule set.
Open the AWS console in your browser
Go to SES
Email Recieving
Select rule set - set as active

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.