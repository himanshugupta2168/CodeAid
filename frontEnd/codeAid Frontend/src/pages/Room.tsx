import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import io from "socket.io-client";
import { LuSendHorizonal } from "react-icons/lu";
import PeerService from "../services/peer";

function Room() {
  const editorRef = useRef<any>(null);
  const chatBoxRef = useRef<any>(null);
  const socket = useMemo(() => io("https://codeaid-h86n.onrender.com:3000"), []);

  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [offset, setOffset] = useState(-1);
  const [message, setMessage] = useState("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      appendMessage(data);
    });

    socket.on("code_change", (data) => {
      editorRef.current.setValue(data.value);
      const newPosition = data.cursorPosition || cursorPosition;
      setCursorPosition(newPosition);
      editorRef.current.setPosition(newPosition);
    });

    socket.on("language_change", (data) => {
      setLanguage(data);
    });

    socket.on("incoming_video", handleIncomingCall);
    socket.on("call_accepted", handleAcceptedCall);

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleEditorChanges: OnChange = (value, event) => {
    if (event.changes[0].rangeOffset !== offset) {
      const newPosition = editorRef.current.getPosition();
      setCursorPosition(newPosition);
      socket.emit("code_change", { value, cursorPosition: newPosition });
      setOffset(event.changes[0].rangeOffset);
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    socket.emit("language_change", selectedLanguage);
  };

  const start = useCallback(async () => {
    console.log("Starting video...");
    setPlaying(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      let video = document.querySelector(".video_elem") as HTMLMediaElement;
      if (video) {
        video.srcObject = stream;
        const offer = await PeerService.getOffer();
        if (offer) {
          console.log(offer);
          socket.emit("outgoing_video", offer);
        } else {
          console.error("Offer is null.");
        }
        setMyStream(stream);
      }
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  }, [socket]);

  const stop = useCallback(() => {
    console.log("Stopping video...");
    setPlaying(false);
    const video = document.querySelector(".video_elem") as HTMLVideoElement;
    const mediaStream = video.srcObject as MediaStream;
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      video.srcObject = null;
    }
  }, []);

  const handleIncomingCall = useCallback(async (data: any) => {
    console.log("incoming call");
    const answer = await PeerService.getAnswer(data);
    if (answer) {
      socket.emit("call_accepted", answer);
    }
  }, [socket]);

  const handleAcceptedCall = useCallback(async (data: any) => {
    PeerService.setLocalDescription(data);
    for (const track of myStream?.getTracks() || []) {
      //@ts-ignore
      PeerService.peer?.addTrack(track, myStream);
    }
  }, [myStream]);

  useEffect(() => {
    PeerService.peer?.addEventListener("track", (event) => {
      setRemoteStream(event.streams[0]);
    });
  }, []);

  const handleMessageBroadcast = () => {
    if (message.length > 0) {
      appendMessage(message);
      socket.emit("message", message);
      setMessage("");
    }
  };

  const appendMessage = (msg: string) => {
    const newElem = document.createElement("li");
    newElem.textContent = msg;
    const properties = ["text-start", "px-4", "bg-purple-500", "rounded-lg", "py-2", "w-auto", "my-2"];
    properties.forEach((property) => {
      newElem.classList.add(property);
    });
    chatBoxRef.current.appendChild(newElem);
  };

  return (
    <div className="hidden md:flex flex-row bg-[#323232] text-white">
      <div className="hidden md:block editor w-9/12 h-screen px-2">
        <div className="mb-1 flex justify-between py-2">
          <p>
            Selected Language : <span className="font-bold">{language}</span>
          </p>
          <div className="flex gap-4">
            <button className="bg-purple-500 px-4 py-1 rounded-lg" onClick={playing ? stop : start}>
              {playing ? "Stop Video" : "Start Video"}
            </button>
            <button className="bg-purple-500 px-4 py-1 rounded-lg cursor-not-allowed" disabled={true}>
              Compile Now
            </button>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-2 py-1 border border-gray-400 rounded text-black"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>
        <div className="w-full h-[93vh] ">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            defaultValue={`// Start coding here!`}
            onChange={handleEditorChanges}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>
      </div>
      <div className="w-[30%] mr-2 my-2">
        <div className="w-full h-[30%] bg-black rounded-lg overflow-hidden">
          <video src="" className="w-[99%] h-[98%] mx-auto video_elem" autoPlay muted></video>
        </div>
        <div className="border border-black mt-2 h-[68%] p-4 relative">
          <div className="overflow-y-auto h-[90%]" ref={chatBoxRef}>
            <ul className="w-full h-full relative"></ul>
          </div>
          <div className="flex gap-2 absolute w-11/12 bottom-4">
            <input
              type="text"
              name=""
              id=""
              className="w-10/12 bg-[#323232] border px-2"
              placeholder="Enter any message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button className="bg-purple-500 px-4 py-2 rounded-lg" onClick={handleMessageBroadcast}>
              <LuSendHorizonal />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
