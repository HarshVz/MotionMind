"use client"

import React, { useEffect, useState } from "react"
import { Send, Loader2 } from "lucide-react"
import axios from "axios"
import {motion} from "motion/react"
import customVarients from "@/utils/initialVariants"

interface ConversationMessage {
  role: "USER" | "SYSTEM";
  messages: string[];
}

export default function Generate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [video, setVideo] = useState("");
  const [urls, setUrl] = useState<string[]>([])
  const [resp, setResp] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [path, setPath] = useState("");
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);

  const onClickHandler = (event: React.FormEvent) => {
    setResp([])
    setVideo("")
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setConversations(prev => [...prev, { "role": "USER", "messages": [query] }]);
    handleGenerate(query).then(() => {
      console.log("Generation complete");
    }).catch(err => {
      console.error("Error in generation:", err);
      setError(true);
    }).finally(() => {
      setLoading(false);
    });

    setQuery("");
  }

  const downloadHandler = () => {
    if (!video) return;

    const a = document.createElement("a");
    a.href = video;
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, "-").slice(0, 19); // e.g., 2025-05-08T14-30-00
    a.download = `video_${timestamp}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  const getVideo = async (videoPath: string) => {
    try {
      const formData = new FormData();
      formData.append("path", videoPath);

      const response = await axios.post("http://localhost:5000/video", formData, {
        responseType: "blob"
        });
        // console.log(response.data)
        const blobobj: Blob = response.data;
        const url = URL.createObjectURL(blobobj)
        setVideo(`${url}`)
        setConversations(prev => [...prev, { "role": "SYSTEM", "messages": [`<video class="aspect-video" style="margin: 0" controls>
                        <source src="${url}" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>`] }]);
        setUrl((prev) => [...prev,`${url}`])

        return true
    } catch (err) {
      console.error("Video Fetching error:", err);
      setError(true);
      return ""
    }
  }

  const handleGenerate = async (query: string) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("query", query);

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: form
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const responses: string[] = []

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Chunk received:", chunk);

        const pathMatch = chunk.match(/<path>([\s\S]*?)<\/path>/);
        if (pathMatch) {

          console.log("Video path matched:", pathMatch[1]);
          getVideo(pathMatch[1]).then(() => {
            console.log("completed")
         })
          setPath(pathMatch[1]);
        } else {
          // Update state with just the new chunk
          setResp(prevResp => [...prevResp, chunk]);
          responses.push(chunk)
        }
      }

      // After streaming is complete, add the response to conversations
    //   setConversations(prev => [...prev, { "role": "SYSTEM", "messages": [...responses] }]);
    //   console.log(conversations)

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
    className="flex flex-col md:flex-row h-screen bg-black">
      {/* Left panel - Conversation history */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-neutral-950 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-neutral-200 font-semibold text-lg">Conversation History</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" id="container">
          {conversations.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === "USER"
                  ? "bg-purple-900/30 border border-purple-800/50"
                  : "bg-neutral-900 border border-neutral-800"
              }`}>
                <div className="text-xs text-neutral-500 mb-1">
                  {msg.role === "USER" ? "You" : "System"}
                </div>

                {msg.messages.map((chunk, i) => (
                  <div key={i} className="text-neutral-200">
                    {chunk.startsWith("<video")
                      ? <video className="aspect-video"  style={{margin: 0}}  controls>
                      <source src={urls[urls.length - 1] ? urls[urls.length - 1] : "null"} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                      : <span>{chunk}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Stream & Output */}
      <div className="w-full md:w-1/2 lg:w-3/5 bg-black flex flex-col">
        {/* Stream output area */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-950/50" id="container">
          <div className="mb-2 text-neutral-400 text-sm font-medium">System Logs</div>

          {resp.length > 0 ? (
            <div className="space-y-3">
              {resp.map((chunk, index) => (
                <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-neutral-200">
                  {chunk.startsWith("<video")
                    ? <div dangerouslySetInnerHTML={{ __html: chunk }} />
                    : <span className="flex flex-col justify-start items-start">
                     {loading && index === resp.length - 1 ? (
                        <div className="w-full flex flex-row  justify-start gap-2 items-center py-3 pt-0 border-b mb-2 border-b-neutral-800">
                             <Loader2 className="animate-spin" size={18} />
                            <p>Processing...</p>
                        </div>
                    ): (
                        <div></div>
                    )}
                    {index+1}. {chunk}</span>
                  }
                </div>
              ))}

                {/* {(video)
                    ? <div dangerouslySetInnerHTML={{ __html: video}} />
                    : <div></div>
                  } */}
                    { (video)
                        ?  <button
                        onClick={() => downloadHandler()}
                        className="py-3 bg-green-950 rounded-full border border-green-700 cursor-pointer transition duration-300 hover:border-green-600 hover:bg-green-950/50 px-8"> Download The Video! </button>

                        : <div></div>
                    }


            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-neutral-600 italic">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing your request...</span>
                </div>
              ) : (
                "Stream output will appear here"
              )}
            </div>
          )}
        </div>
        {/* Error message */}
        {error && (
          <div className="m-4 p-3 bg-red-900/30 border-2 border-red-800 rounded text-red-200 text-sm">
            An error occurred. Please try again or check your connection.
            <button
              className="ml-2 underline"
              onClick={() => setError(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input form */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950">
          <form onSubmit={onClickHandler} className="flex gap-3">
            <input
              className="flex-1 bg-neutral-900 text-neutral-100 rounded-lg px-4 py-3 border border-neutral-800 hover:border-neutral-700 focus:border-purple-700 focus:outline-none transition-colors"
              placeholder="Describe the animation you want..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`h-12 w-12 rounded-full flex justify-center items-center ${
                loading || !query.trim()
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
                  : 'bg-purple-900 hover:bg-purple-800 border-purple-700 text-white cursor-pointer'
              } border transition-all duration-300`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
