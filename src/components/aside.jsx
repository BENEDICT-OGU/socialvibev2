import React from "react";

const Aside = () => {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-900 w-1/2 h-[100vh] hidden md:block relative overflow-hidden">
      <p className="mb-8 ml-8 absolute bottom-0 text-5xl font-bold text-white">
        PR
      </p>
      <div className="">
        <div className="rounded-full border-[1.5px] border-white w-[26rem] h-[26rem] absolute bottom-0 translate-x-[-30%] translate-y-[10%]"></div>
        <div className="rounded-full border-[1.5px] border-white w-[26rem] h-[26rem] absolute bottom-0 translate-x-[-50%] translate-y-[10%]"></div>
      </div>
    </div>
  );
};

export default Aside;