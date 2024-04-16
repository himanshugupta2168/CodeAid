import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useParams } from "react-router-dom";
import Editor, { OnChange } from "@monaco-editor/react";
import io from "socket.io-client";
import { LuSendHorizonal } from "react-icons/lu";
function Room() {
  // const parameter = useParams();
  // to handle server responses
  const editorRef = useRef<any>(null);
  const chatBoxRef= useRef(null);
const socket = useMemo(() => io("http://localhost:3000"), []);
const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 }); // Initialize with a default position
const [offset, setOffset] = useState(-1);
const [message, setMessage]=  useState("");

useEffect(() => {
  //@ts-ignore
  socket.on("connect", (s:any)=> {
    console.log("connected");
    // console.log(s);
  });
  socket.on("message", (data)=>{
    const properties = [ "text-start", "px-4" , "bg-purple-500", "rounded-lg", "py-2","w-auto","my-2"];
    const newElem = document.createElement('li');
    newElem.textContent = data;

    properties.forEach(property => {
        newElem.classList.add(property);
    });
    
    chatBoxRef.current.appendChild(newElem);

  })



  socket.on("code_change", (data) => {
    // console.log(data);
    editorRef.current.setValue(data.value);
    const newPosition = data.cursorPosition || cursorPosition; // Use a default position if data.cursorPosition is not available
    setCursorPosition(newPosition);
    editorRef.current.setPosition(newPosition);
  });

  socket.on("language_change", (data)=>{
    setLanguage(data);
  })

  return () => {
    socket.disconnect();
  };
}, [socket]);

// editor changes function
const handleEditorChanges: OnChange = (value, event) => {
  if (event.changes[0].rangeOffset !== offset) {
    const newPosition = editorRef.current.getPosition();
    setCursorPosition(newPosition);
    socket.emit("code_change", { value, cursorPosition: newPosition });
    setOffset(event.changes[0].rangeOffset);
  }
};


  // language control functions
  const [language, setLanguage] = useState("javascript");
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    socket.emit("language_change", event.target.value)
  };
  // video streaming functions
  const [playing, setPlaying] = useState(false);

  const start = () => {
    console.log("Starting video...");
    setPlaying(true);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        let video = document.getElementsByClassName(
          "video_elem"
        )[0] as HTMLMediaElement;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };
  // to stop the videoand audio
  const stop = () => {
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
  };
  // mesaage handlers 
  const handleMessageBroadcast = () => {
    const properties = [ "text-end", "px-4" , "bg-purple-500", "rounded-lg", "py-2","w-auto","my-2"];
    const newElem = document.createElement('li');
    newElem.textContent = message;

    properties.forEach(property => {
        newElem.classList.add(property);
    });
    
    chatBoxRef.current.appendChild(newElem);
    socket.emit("message", message);
    setMessage("");
}





  return (
    <div className="hidden md:flex flex-row bg-[#323232] text-white">
      <div className="hidden md:block editor w-9/12 h-screen px-2">
        <div className="mb-1 flex justify-between py-2">
          <p>
            Selected Language : <span className="font-bold">{language}</span>
          </p>
          <div className="flex gap-4">
            <button
              className="bg-purple-500 px-4 py-1 rounded-lg"
              onClick={playing ? stop : start}
            >
              {playing ? "Stop Video" : "Start Video"}
            </button>
            <button
              className="bg-purple-500 px-4 py-1 rounded-lg  cursor-not-allowed"
              disabled={true}
            >
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
            onMount={(editor)=>{editorRef.current= editor}}
          />
        </div>
      </div>
      <div className=" w-[30%] mr-2 my-2">
        <div className="w-full h-[30%]  bg-black rounded-lg overflow-hidden">
          <video
            src=""
            className=" w-[99%] h-[98%] mx-auto video_elem"
            autoPlay
            muted
          ></video>
        </div>
        {/* chat component */}
        <div className="border border-black mt-2 h-[68%] p-4 relative">
          <div className="overflow-y-auto border h-[90%]">
            <ul className="w-full h-full relative" ref={chatBoxRef}>
            </ul>

          </div>
          <div className="flex gap-2 absolute w-11/12 bottom-4">
            <input type="text" name="" id="" className="w-10/12 bg-[#323232] border px-2 " placeholder="Enter any  mesage..."  onChange={(e)=>{setMessage(e.target.value)}} value={message}/>
            <button className=" bg-purple-500 px-4 py-2 rounded-lg" onClick={handleMessageBroadcast}><LuSendHorizonal/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
