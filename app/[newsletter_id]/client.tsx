"use client"

import { useEffect } from "react"

export default function Client ({newsletterId }: { newsletterId: string}) {
  
  const newsletterReadFn = async (newsletterId: string) => {
    const res = await fetch("/api/read", {
      method: "POST",
      body: JSON.stringify({ newsletterId: newsletterId }),
    })
    console.log('res', res)
  }
  // on scroll call function
  useEffect(() => {
    newsletterReadFn(newsletterId)
  }, [])
  
  return (<></>)
}