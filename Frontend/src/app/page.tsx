"use client"
import Link from "next/link"
import {motion} from "motion/react"
import customVarients from "@/utils/initialVariants"

export default function Home() {
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
            <div className="min-h-screen max-w-3xl w-full flex justify-start py-5 md:justify-center items-center flex-col">

                <div className="w-full mx-auto text-left prose prose-invert">
                    <h1 className="text-4xl font-bold mb-4">Meet MotionMind — Animate Ideas. Instantly.</h1>

                    <p className="text-lg mb-2">
                        Say goodbye to hours of coding in Manim just to create one video. <strong>MotionMind</strong> transforms your math concepts, formulas, and lessons into stunning animations — with nothing more than a simple prompt.
                    </p>

                    <p className="text-lg mb-6">
                        Built for educators, students, content creators, and visual storytellers — no programming needed. Just type, click, and let your ideas come to life.
                    </p>
                    <div className="">
                        <li className="">
                            ⚡ Zero Coding, Just Prompt
                        </li>
                        <li className="">
                            🎬 Clean, Smooth Animations
                        </li>
                        <li className="">
                            📚 Perfect for Lessons & Tutorials
                        </li>
                    </div>

                    <div className="w-full grid md:grid-cols-2 gap-5 md:gap-3 pt-5">
                        <Link href="/video" className="bg-neutral-950 px-4 py-3 md:rounded-2xl border-2 border-neutral-800 text-center no-underline hover:border-neutral-600 hover:-translate-y-1 transition-all duration-300">
                            ⚡ Try Animations Now
                        </Link>
                        <Link href="/examples" className="bg-neutral-950 px-4 py-3 md:rounded-2xl border-2 border-neutral-800 text-center no-underline hover:border-neutral-600 hover:-translate-y-1 transition-all duration-300">
                            🎬 Checkout Examples
                        </Link>
                    </div>

                    <div>
                        <video src="./preview.mp4" autoPlay loop muted></video>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}
