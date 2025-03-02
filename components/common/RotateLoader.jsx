// RotatingLoaderWithImage.jsx
import React from 'react';

const RotatingLoaderWithImage = () => {
  return (
    <div className="flex items-center justify-center h-[50vh] relative">
      <div className="w-20 h-20 border-[6px] border-[#EC008C] border-solid border-t-transparent rounded-full animate-spin"></div>
      <img
        src="/assets/clock.svg"
        alt="Center Icon"
        className="absolute w-8 h-8"
      />
      <p className="absolute mt-28 text-black font-semibold">Loading...</p>
    </div>
  );
};

export default RotatingLoaderWithImage;
