import { Discord, Github, Twitter } from "@/components/icons"

export default function Home() {
  return (
    <main className="flex  px-4 py-12">
      <div className="">
        <h2 className="text-2xl mt-8">This is a simple newsletter aggregator</h2>
        <h2 className="text-2xl ">leveraging Nextjs with TailwindCSS and Shadcn</h2>
        <h2 className="text-2xl ">built on AWS with SST, CDK, and SES</h2>
        <div className="flex flex-row mt-20 justify-between">
          <h2 className="text-2xl ">Get the code</h2>
          <div className="w-24">
            <Github />
          </div>
        </div>
        <div className="flex flex-row sm:mt-16 my-12 justify-between">
          <h2 className="text-2xl ">Contact me</h2>
          <div className="w-24 flex flex-row justify-between">
            <Discord />
            <Twitter />
          </div>
        </div>
      </div>

      <div className="mt-28 sm:mt-40"></div>
    </main>
  )
}

const Background = () => {
  return (
    <>
      {" "}
      <div className="z-10 absolute bg-radial-gradient from-teal-400 via-teal-500 to-yellow-200 gradient-radial-to-br blur-2xl"></div>
      <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
    </>
  )
}

