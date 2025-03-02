import Image from 'next/image';
import React from 'react';

const InboxItem = ({ name, message, time, isActive, unreadCount, avatar }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 mid:p-4 border-b border-gray-200 ${isActive ? '' : 'hover:bg-gray-100'
        }`}
    >
      <div className="flex items-center space-x-2 mid:space-x-4">
        <div className='relative'>
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <span className="bg-[#28B446] text-white text-xs w-2.5 h-2.5 absolute -right-1 bottom-0 flex items-center justify-center rounded-full">
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm mainbluetext truncate w-40 maxmid:w-full">{message}</p>
          <p className='text-sm maingray truncate w-40 maxmid:w-full'>Increase the hourly price from $12 t...</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-gray-400">{time}</p>
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <span className="mainblue text-white text-xs w-5 h-5 mr-2 mt-0.5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
            {/* <Image
              src="/assets/threeDots.svg"
              alt="message"
              height="22"
              width="22"
              className="w-2 h-3 mt-1.5"
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

const Inbox = () => {

  const messages = [
    {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    },
    {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    },

    {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    },
    {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    }, {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    }, {
      name: 'Leslie Alexander',
      message: 'I Want To Clean My Home, I Like...',
      time: '3:98 PM',
      isActive: true,
      unreadCount: 2,
      avatar: '/assets/mapprofile.svg', // Replace with your avatar URL
    },
    // Add more message objects as needed...
  ];

  return (
    <div className="lg:max-w-md mx-3 lg:mx-0 lg:ml-4 mb-3  rounded-lg mt-28 md:mt-44 lg:mt-28">
      <div className="p-4 border-gray-200">
        <h3 className="text-3xl font-semibold text-gray-900">Inbox</h3>
        <div className="mt-3 flex items-center inputshadow p-2">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-white outline-none px-2 text-gray-700"
          />
          <button className="text-pink-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016.35 6.35z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className='inboxHeight overflow-y-auto '>
        {messages.map((message, index) => (
          <InboxItem key={index} {...message} />
        ))}
      </div>
    </div>
  );
};

export default Inbox;
