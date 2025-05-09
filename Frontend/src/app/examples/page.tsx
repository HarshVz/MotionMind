"use client"
import Link from "next/link"
import {motion} from "motion/react"
import customVarients from "@/utils/initialVariants"

export default function Examples(){
    return (
        <motion.div
        variants={customVarients}
        initial="hidden"
        animate="show"
        exit="hidden"
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="w-full bg-black flex md:justify-center item-center min-h-screen h-full dotted-bg mx-auto px-5">
            <div className="min-h-screen max-w-3xl w-full flex justify-start md:justify-center items-center flex-col py-10">

                <div className="w-full mx-auto text-left prose prose-invert">

                <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-0">Examples</h1>
                {/* <Link href="/" className="">Go Back</Link> */}
                </div>

<p className="text-lg mb-2">
These examples showcase the power of simple prompts turned into smooth, high-quality visuals. Whether you're teaching, learning, or presenting — see what's possible with just a few clicks. <Link href="/video" className="">try now</Link>
</p>

<div className="w-full grid grid-cols-1 gap-5 mt-6">
    {
        [1,2,3,4,5,6,7,8,9].map((vid, index) => (
            <div key={index} className="bg-neutral-950 p-2">
                <video src={`./videos/vid (${vid}).mp4`} className="mb-0 mt-0" autoPlay loop muted />
            </div>
        ))
    }
</div>


                </div>
            </div>
        </motion.div>
    )
}
