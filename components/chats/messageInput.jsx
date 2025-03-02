import Image from "next/image";
import { useState } from "react";


const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex items-center p-4 bg-white inputshadow">
      <textarea
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        rows={1}
        className="flex-grow px-4 py-3 w-full rounded-lg GrayBG outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-2 sm:ml-4 px-3 sm:px-6 py-3.5 md:py-3 flex items-center gap-2 mainblue text-white rounded-lg"
      >
        <span className="sm:block hidden">Send</span>
        <Image
          src="/assets/Send.svg"
          alt="message"
          height="22"
          width="22"
          className="sm:w-4 sm:h-4"
        />
      </button>
    </div>
  );
};

export default MessageInput;