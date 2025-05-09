"use client"

import React,{useState} from "react"
import {Send} from "lucide-react"
import axios from "axios"
import {motion} from "motion/react"
import customVarients from "@/utils/initialVariants"

interface ResponseInterface{
    code: string,
    classname: string,
    instruction: string
}

export default function Generate(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [video, setVideo] = useState("")
    const [resp, setResp] = useState<string[]>([])
    const [query, setQuery] = useState("")
    const [path, setPath] = useState("")
    const [conversations, setConversations] = useState([{
        "role": "USER",
        "messages": ["How are you?"]
    }, {
        "role": "SYSTEM",
        "messages": ["I am Fine!", "How can i help you today?"]
    }])

    const onClickHandler = (event: any) => {
        event.preventDefault()
        console.log(query)
        setConversations(prev => [...prev, {"role":"USER", "messages": [query]}])
        handleGenerate(query).then((res) => {
            console.log(res)
        });
        setQuery("")
    }

    const getVideo = async (videoPath: string) => {
        try {
            const formData = new FormData();
            formData.append("path", videoPath)

            const response = await axios.post("http://localhost:5000/video", formData, {
                responseType: "blob"
            });
            // console.log(response.data)
            const blobobj: Blob = response.data;
            const url = URL.createObjectURL(blobobj)
            setVideo(url)
            setResp(prev => [...prev,`<video class="aspect-video" style="margin: 0" controls>
                             <source src="${url}" type="video/mp4" />
                             Your browser does not support the video tag.
                           </video>`])

            return true
        } catch (err) {
            console.error("Video Fetching error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    const handleGenerate = async (query: string) => {
        try{
            const form = new FormData()
            form.append("query", query)

            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                body: form
              });
              if (!response.body) throw new Error("No response body");

              const reader = response.body.getReader();
              const decoder = new TextDecoder();

              while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                console.log("Chunk received:", chunk);

                const match = chunk.match(/<path>(.*?)<\/path>/);

                if (match && match[1]) {
                    console.log("matched : ", match[1]);
                    setPath(match[1]) // Output: This is the content I want
                    const res = await getVideo(match[1]);
                    console.log(res)
                } else {
                    // Update state with just the new chunk
                    setResp(prevResp => [...prevResp, chunk]);
                }
              }
              setConversations(prev => [...prev, {"role":"SYSTEM", "messages": resp}])
              setResp([])

        } catch (err) {
          console.error("Streaming error:", err);
          setError(true);
        } finally {
          setLoading(false);
        }

    }


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
        className="">
            <div>
                <form onSubmit={onClickHandler} className="flex justify-center items-center gap-3 px-3 py-3">
                    <input className="bg-neutral-800 text-neutral-100 rounded px-5 h-10 w-full border border-neutral-700 hover:border-neutral-500 outline-none" placeholder="Enter the query...." type="text" name="query" id="" value={query} onChange={(e) => setQuery(e.target.value)} />

                    <button className="h-10 w-10 rounded-full bg-neutral-800 flex justify-center items-center cursor-pointer border-neutral-700 hover:border-neutral-500 border-2 aspect-square transition-all duration-300"><Send width={18}/></button>
                </form>
                </div>
                <div className="w-full px-4 space-y-4">
                    {
                        conversations.length > 0 ? (
                            conversations.map((msg, index) => (
                                <div key={index}>

                                {msg.role === "SYSTEM" ? (
                                    <div className="w-7/8 flex flex-col gap-3 justify-start item-center">
                                    {
                                        msg.messages.length > 0 ?
                                        (msg.messages.map((chunk, index) => (
                                            <div className="bg-neutral-900 p-3 rounded prose md:prose-lg lg:prose-xl prose-invert" key = {index}>
                                                {
                                                    chunk.startsWith("<video")
                                                    ? <div className="" dangerouslySetInnerHTML={{ __html: chunk }} />
                                                    : <span> {chunk} </span>
                                                }
                                            </div>
                                        ))) : (
                                            ""
                                        )
                                    }
                                    {/* {msg.role} */}
                                    </div>
                                ) : (
                                    <div className="w-full flex justify-end item-end">
                                    {
                                        msg.messages.length > 0 ?
                                        (msg.messages.map((chunk, index) => (
                                            <div className="bg-neutral-900 p-3 rounded prose md:prose-lg lg:prose-xl prose-invert" key = {index}>
                                                {
                                                    chunk.startsWith("<video")
                                                    ? <div className="" dangerouslySetInnerHTML={{ __html: chunk }} />
                                                    : <span> {chunk} </span>
                                                }
                                            </div>
                                        ))) : (
                                            ""
                                        )
                                    }
                                    </div>
                                )}

                                 </div>
                            ))
                        ): (<div>Nothing</div>)
                    }

                </div>
                    <div className="w-full px-4 space-y-4 pt-4">
                    <div className="w-7/8 flex flex-col gap-3 justify-start item-center">
                    {
                        resp.length > 0 ?
                        (resp.map((chunk, index) => (
                            <div className="bg-neutral-900 p-3 rounded prose md:prose-lg lg:prose-xl prose-invert" key = {index}>
                                {
                                    chunk.startsWith("<video")
                                    ? <div className="" dangerouslySetInnerHTML={{ __html: chunk }} />
                                    : <span> {chunk} </span>
                                }
                            </div>
                        ))) : (
                            ""
                        )
                    }
                    </div>
                    </div>
                <div>
                </div>
            </motion.div>
    )
}
