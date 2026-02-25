import React from "react";
import {
  Search,
  ShoppingCart,
  User,
  List,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Phone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Agadir Special Deals",
    title: "PREMIUM",
    subtitle: "ELECTRONICS.",
    desc: "Upgrade your home with the latest tech. Free delivery in Agadir.",
    img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    color: "#111827",
  },
  {
    id: 2,
    tag: "Limited Time Offer",
    title: "SMART",
    subtitle: "WASHING MACHINES.",
    desc: "Save up to 30% on top-rated laundry appliances this week.",
    img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
    color: "#1e293b",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Samsung 55" Crystal UHD 4K Smart TV',
    price: 4299,
    originalPrice: 7499,
    discount: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "LG Vivace 9KG Front Load Washing Machine",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Bosch Serie 4 NoFrost Refrigerator 400L",
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Whirlpool Split Air Conditioner 12000 BTU",
    price: 3199,
    originalPrice: 4099,
    discount: 21,
    imageUrl:
      "https://images.unsplash.com/photo-1610552050890-fe99536c2615?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Sony PlayStation 5 Console Digital Edition",
    price: 6799,
    originalPrice: 8599,
    discount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80",
  },
];

const CATEGORIES = [
  { title: "Home Appliances", hasDropdown: true },
  { title: "Air Conditioning & Comfort", hasDropdown: true },
  { title: "Small Appliances", hasDropdown: true },
  { title: "TV & Electronics", hasDropdown: true },
  { title: "Refrigerators", hasDropdown: false },
  { title: "Washing Machines", hasDropdown: false },
];
const CATEGORIES_SECTION = [
  {
    id: 1,
    name: "Refrigerators",
    icon: "❄️",
    count: "12 Items",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    name: "Washing Machines",
    icon: "🧺",
    count: "8 Items",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    name: "Air Conditioning",
    icon: "🌬️",
    count: "15 Items",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    name: "TV & Electronics",
    icon: "📺",
    count: "20 Items",
    bgColor: "bg-orange-50",
  },
  {
    id: 5,
    name: "Small Appliances",
    icon: "☕",
    count: "25 Items",
    bgColor: "bg-pink-50",
  },
  {
    id: 6,
    name: "Cooking",
    icon: "🍳",
    count: "10 Items",
    bgColor: "bg-yellow-50",
  },
];

const REVIEWS = [
  {
    id: 1,
    name: "Ahmed B.",
    rating: 5,
    comment: "Excellent product! Fast delivery and amazing quality.",
    product: 'Samsung 55" Crystal UHD 4K Smart TV',
  },
  {
    id: 2,
    name: "Sara L.",
    rating: 4,
    comment: "The washing machine works perfectly. Very happy with it!",
    product: "LG Vivace 9KG Front Load Washing Machine",
  },
  {
    id: 3,
    name: "Youssef M.",
    rating: 5,
    comment: "Refrigerator keeps everything super fresh. Highly recommend.",
    product: "Bosch Serie 4 NoFrost Refrigerator 400L",
  },
];
const ReviewCard = ({ review }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 m-1 shadow-sm hover:shadow-md transition-shadow duration-500">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
        {review.name.charAt(0)}
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-800 text-sm">{review.name}</h4>
        <p className="text-xs text-gray-400">{review.product}</p>
      </div>
    </div>
    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  </div>
);
const ReviewsSection = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-3xl text-gray-900 mb-2 tracking-tighter">Customer Reviews</h2>
        <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
      </div>
    </div>

    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={20}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {REVIEWS.map((review) => (
        <SwiperSlide key={review.id}>
          <ReviewCard review={review} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);
const CategorySection = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
    {/* Header Section */}
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-3xl text-gray-900 mb-2 tracking-tighter ">
          Shop By Categories
        </h2>
        <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
      </div>
      <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
        View All <ChevronRight size={16} />
      </button>
    </div>

    {/* Categories Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {CATEGORIES_SECTION.map((cat) => (
        <div
          key={cat.id}
          className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-105"
        >
          {/* Icon Circle */}
          <div
            className={`${cat.bgColor} w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm`}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
          </div>

          {/* Text Info */}
          <h3 className="font-bold text-gray-800 text-center text-sm group-hover:text-blue-600 transition-colors">
            {cat.name}
          </h3>
          <p className="text-gray-400 text-xs mt-1">{cat.count}</p>
        </div>
      ))}
    </div>
  </section>
);
const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="rounded-[2.5rem] overflow-hidden shadow-xl "
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="h-[450px] flex flex-col md:flex-row items-center px-10 md:px-17  relative overflow-hidden"
              style={{ backgroundColor: slide.color }}
            >
              <div className="flex-1 py-12 z-20">
                <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
                  {slide.tag}
                </span>
                <h2 className="text-white text-5xl md:text-5xl font-black leading-tight mb-2 uppercase">
                  {slide.title} <br />{" "}
                  <span className="primary">{slide.subtitle}</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 ">{slide.desc}</p>
                <button className="bg-white text-sm text-black px-8 py-4 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                  Shop Now
                </button>
              </div>

              <div className="flex-1 relative h-full w-full flex justify-center items-center z-10">
                <div className="absolute w-80 h-80 md:w-[500px] md:h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full max-w-sm drop-shadow-2xl transform hover:rotate-2 transition-transform duration-700"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(255,255,255,0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-pagination-bullet {
          background: white !important;
          width: 12px;
          height: 12px;
        }
        .swiper-pagination-bullet-active {
          width: 30px;
          border-radius: 10px;
          background: #3b82f6 !important;
        }
      `}</style>
    </section>
  );
};

const ProductCard = ({ product }) => (
  <div className="bg-white border border-gray-100 rounded-3xl relative group hover:shadow-md transition-all duration-500 cursor-pointer">
    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] align-middle font-black px-3 py-3 rounded-se-3xl rounded-bl-2xl z-10 text-center leading-tight">
      {product.discount}% <br /> OFF
    </div>

    <div className="w-full rounded-3xl   overflow-hidden ">
      {" "}
      {/* optional extra wrapper */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-full object-contain transform
                   transition-transform duration-500
                   hover:scale-110 origin-center"
      />
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-800 text-sm  mb-4 leading-tight">
        {product.name}
      </h3>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl font-black text-gray-900">
          {product.price} DH
        </span>
        <span className="text-gray-400 text-sm line-through font-medium">
          {product.originalPrice} DH
        </span>
      </div>
      <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
        <p className="text-green-600 text-xs font-bold uppercase tracking-wider">
          Save {product.originalPrice - product.price} DH
        </p>
        <button className="bg-blue-50 p-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default function GalaxyHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Navigation */}
      <div className="bg-white py-4 border-b border-gray-100 overflow-x-auto no-scrollbar flex">
        <div className="max-w-7xl mx-auto px-4 flex gap-3">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0 transition-colors ${
                i === 0
                  ? "bg-[#008ECC] text-white border border-[#008ECC]" // Active state (like "Groceries" in your image)
                  : "bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200 hover:bg-gray-100" // Inactive state
              }`}
            >
              {cat.title}
              {cat.hasDropdown && (
                <ChevronDown
                  size={16}
                  className={i === 0 ? "text-white" : "text-[#008ECC]"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="pb-20">
        <Hero />

        <CategorySection />
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl  text-gray-900 mb-2  tracking-tighter">
                Popular Items
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
            </div>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All Deals <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
        <ReviewsSection />
      </main>

      <a
        href="https://wa.me/2126XXXXXXXX"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-3 rounded-full shadow-2xl  transition-transform z-50 flex items-center group"
      >
        <span className="max-w-0  overflow-hidden group-hover:max-w-xs transition-all duration-500 hover:pe-3 whitespace-nowrap">
          Order via WhatsApp
        </span>
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
}
