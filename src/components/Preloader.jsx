import React from 'react';

const Preloader = ({ isLoading }) => {
  return (
    <div
      className={`
        fixed inset-0 bg-black z-[9999] 
        flex justify-center items-center
        transition-opacity duration-1000 ease-in-out
        ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* 1. Make sure you have a 'logo.png' (or .svg) inside your /public folder.
         2. If you don't have one yet, it will show the alt text or a broken icon, 
            which is fine for testing.
      */}
      <img
        src="/logo.png" 
        alt="MadeByPriest"
        className="w-42 h-42 md:w-42 md:h-64 animate-pulse object-contain"
      />
    </div>
  );
};

export default Preloader;