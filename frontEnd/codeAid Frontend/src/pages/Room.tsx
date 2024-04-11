import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
// import io from 'socket.io-client';
// import ReactPlayer from 'react-player';

function Room() {
  const [language, setLanguage] = useState('javascript');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => { 
    setLanguage(event.target.value);
  };

  return (
    <div className="hidden md:flex flex-row bg-[#323232] text-white">
      <div className="hidden md:block editor w-9/12 h-screen px-2">
        <div className="mb-1 flex justify-between py-2">
          <p>
            Selected Language : <span className='font-bold'>{language}</span>
          </p>
          <div className='flex gap-4'>
            <button className='bg-purple-500 px-4 py-1 rounded-lg'>Compile Now </button>
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
          />
        </div>
      </div>
      <div className=' w-[30%] mr-2 my-2'>
        <div className='w-full h-[30%]  bg-black rounded-md'>
          {/* video component here  */}
        </div>
        <div className='border border-black mt-2 h-[68%] p-4'>
          {/* Chat component will go here */}
          Chat here
        </div>
      </div>
    </div>
  );
}
export default Room;
