import React from 'react';

const Preloader = ({ isLoading }) => {
  return (
    <div
      className={`
        fixed inset-0 bg-ink-900 z-[9999]
        flex justify-center items-center
        transition-opacity duration-1000 ease-in-out
        ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <img
        src="/logo.png"
        alt="Made by Priest logo"
        className="w-40 h-40 md:w-56 md:h-56 animate-pulse object-contain"
      />
    </div>
  );
};

export default Preloader;