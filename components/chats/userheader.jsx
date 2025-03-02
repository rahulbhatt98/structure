import Image from "next/image";

const UserHeader = ({ name, avatar, onlineStatus }) => {
  return (
    <div className="flex items-center p-4 bg-white inputshadow">
      <img
        src={avatar}
        alt={name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="ml-4">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <div className="flex items-center gap-1">
          <span className="bg-[#28B446] text-white text-xs w-2.5 h-2.5 flex items-center justify-center rounded-full">
          </span>
          <p className="text-sm maingray">{onlineStatus ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="ml-auto">
        {/* Add options icon or dropdown here if needed */}
        <Image
          src="/assets/threeDots.svg"
          alt="message"
          height="22"
          width="22"
          className="w-3 h-3"
        />
      </div>
    </div>
  );
};

export default UserHeader;
