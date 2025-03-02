import { useState } from "react";
import ChatBox from "./chatBox";
import MessageInput from "./messageInput";
import RequestInfo from "./requestInfo";
import UserHeader from "./userheader";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      name: 'Leslie Alexander',
      message: 'I had chosen around $10',
      time: '12:43 AM',
      isSender: false,
    },
    {
      name: 'Erik',
      message: 'Welcome! I am here to help!',
      time: '12:45 AM',
      isSender: true,
    },
    {
      name: 'Erik',
      message: 'Increase the hourly price from $12 to $15',
      time: '12:45 AM',
      isSender: true,
    },
    {
      name: 'Leslie Alexander',
      message: 'You can start working tomorrow evening!',
      time: '12:43 AM',
      isSender: false,
    },
  ]);

  const handleSendMessage = (newMessage) => {
    const newMsg = {
      name: 'Erik',
      message: newMessage,
      time: new Date().toLocaleTimeString(),
      isSender: true,
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <div className="mt-28 md:mt-44 lg:mt-28 mx-3 lg:mx-0 bg-[#FFFCFD] lg:mr-3 my-6">
      {/* User Header */}
      <UserHeader
        name="Leslie Alexander"
        avatar="/assets/mapprofile.svg"
        onlineStatus={true}
      />

      {/* Request Information */}
      <div className="overflow-y-auto chatHeight">

        <RequestInfo
          request="Want To Clean My Home, I Like Deep Cleaning Under Beds And Couches"
          price={252}
          service="House Maintenance"
          serviceType="Cleaning"
          location="15205 North Kierland Blvd. Suite 100"
          dateTime="18/08/2024 08:00AM"
        />

        {/* Chat Box */}
        <ChatBox messages={messages} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
