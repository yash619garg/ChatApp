import React from "react";
import "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";

const EmptyChatContainer = () => {
  return (
    <div className="w-[70vw] max-md:w-[60vw] max-sm:w-[0vw] flex flex-col justify-center items-center left-0 top-0 overflow-hidden bg-[#ecf1f5] relative  h-[100vh] ">
      <div className="w-[300px] max-sm:h-[50vh] flex flex-col gap-5 items-center h-[300px]">
        <dotlottie-player
          src="https://lottie.host/bffeda67-47f4-4507-bebb-85f84761f76d/usGhPHJwsT.json"
          background="transparent"
          speed="1"
          loop
          autoplay
        ></dotlottie-player>
      </div>

      <div className="text-3xl tracking-wider font-sans text-gray-500 font-bold">
        Welcome to <span className="text-purple-500"> AnonConvo </span>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
