import React from 'react'

// components/Hero.jsx
export const Hero = () => (
  <section className="px-8 my-6">
    <div className="bg-[#1e2a44] text-white rounded-3xl p-12 flex justify-between items-center relative overflow-hidden">
      <div className="z-10">
        <p className="text-xl mb-2">أفضل العروض على أجهزة التكييف</p>
        <h2 className="text-6xl font-black mb-4 uppercase">
          تخفيضات <br /> تصل لـ 40%
        </h2>
        <button className="bg-white text-[#1e2a44] px-8 py-3 rounded-full font-bold">
          تسوق الآن
        </button>
      </div>
      <img src="/ac-unit.png" alt="Promo" className="w-1/3 z-10" />
      {/* دوائر خلفية للتزيين كما في الصورة */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 -mr-20 -mt-20"></div>
    </div>
  </section>
);

