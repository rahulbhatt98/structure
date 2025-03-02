import Image from "next/image";

const ChatMessage = ({ isSender, message, time, name }) => {
  return (
    <div
      className={`flex items-start mb-4 ${isSender ? 'justify-end' : 'justify-start'
        }`}
    >
      {!isSender && (
        <img
          src="/assets/mapprofile.svg" // Avatar placeholder
          alt={name}
          className="w-10 h-10 rounded-full mr-2"
        />
      )}
      <div>
        <div>
          <span className={`block text-xs ${isSender ? 'text-right' : 'text-left'}`}>
            <span className="mr-1 font-medium">Erick</span>
            <span className="text-gray-500">{time}</span>
          </span>
        </div>

        <div className={`max-w-xs p-3 rounded-lg ${isSender ? 'mainblue text-white' : 'bg-[#1B75BC1A] text-gray-800'}`}>
          <p>{message}</p>
        </div>
        {
          isSender && (
            <div className="flex justify-end items-end">
              <Image
                src="/assets/read.svg"
                alt="message"
                height="22"
                width="22"
                className="w-4 h-4"
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

const ChatBox = ({ messages }) => {
  return (
    <div className="flex flex-col bg-white p-4 ">
      {messages.map((msg, index) => (
        <ChatMessage key={index} {...msg} />
      ))}
    </div>
  );
};

export default ChatBox;
