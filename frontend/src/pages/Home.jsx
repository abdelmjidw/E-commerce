import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  List, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Phone
} from 'lucide-react';

// استيراد Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// استيراد Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
// استيراد Swiper modules
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// --- بيانات السلايدر (HERO SLIDES) ---
const HERO_SLIDES = [
  {
    id: 1,
    tag: "Agadir Special Deals",
    title: "PREMIUM",
    subtitle: "ELECTRONICS.",
    desc: "Upgrade your home with the latest tech. Free delivery in Agadir.",
    img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    color: "#111827"
  },
  {
    id: 2,
    tag: "Limited Time Offer",
    title: "SMART",
    subtitle: "WASHING MACHINES.",
    desc: "Save up to 30% on top-rated laundry appliances this week.",
    img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
    color: "#1e293b"
  }
];

// --- بيانات المنتجات (PRODUCTS) ---
const PRODUCTS = [
  { id: 1, name: 'Samsung 55" Crystal UHD 4K Smart TV', price: 4299, originalPrice: 7499, discount: 42, imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'LG Vivace 9KG Front Load Washing Machine', price: 3499, originalPrice: 4999, discount: 30, imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Bosch Serie 4 NoFrost Refrigerator 400L', price: 6999, originalPrice: 8999, discount: 22, imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Whirlpool Split Air Conditioner 12000 BTU', price: 3199, originalPrice: 4099, discount: 21, imageUrl: 'https://images.unsplash.com/photo-1610552050890-fe99536c2615?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Sony PlayStation 5 Console Digital Edition', price: 6799, originalPrice: 8599, discount: 20, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80' },
];

const CATEGORIES = [
  'Air Conditioning', 'Small Appliances', 'TV & Electronics', 'Refrigerators', 'Washing Machines', 'Cooking'
];

// --- المكونات الفرعية ---

const Header = () => (
  <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <List size={24} />
          </div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">GALAXY DIGITAL</h1>
        </div>
        <div className="hidden md:flex flex-1 max-w-xl mx-10">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search appliances..." 
              className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
            />
            <Search className="absolute left-4 top-2.5 text-gray-400 group-focus-within:text-blue-500" size={18} />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition">
            <User size={20} />
            <span>Login</span>
          </button>
          <div className="relative cursor-pointer hover:scale-105 transition">
            <ShoppingCart size={24} className="text-blue-600" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">3</span>
          </div>
        </div>
      </div>
    </div>
  </header>
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
                  {slide.title} <br/> <span className="text-blue-500">{slide.subtitle}</span>
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

      {/* تنسيقات CSS مخصصة للسلايدر */}
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
  <div className="bg-white border border-gray-100 rounded-3xl p-5 relative group hover:shadow-2xl transition-all duration-500">
    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-4 rounded-bl-3xl z-10 text-center leading-tight">
      {product.discount}% <br/> OFF
    </div>
    <div className="bg-gray-50 rounded-2xl h-48 flex justify-center items-center mb-5 overflow-hidden">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="h-36 object-contain group-hover:scale-110 transition-transform duration-500" 
      />
    </div>
    <h3 className="font-bold text-gray-800 text-sm h-10 line-clamp-2 mb-4 leading-tight">
      {product.name}
    </h3>
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xl font-black text-gray-900">{product.price} DH</span>
      <span className="text-gray-400 text-sm line-through font-medium">{product.originalPrice} DH</span>
    </div>
    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
      <p className="text-green-600 text-xs font-bold uppercase tracking-wider">
        Save {product.originalPrice - product.price} DH
      </p>
      <button className="bg-blue-50 p-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
        <ShoppingCart size={18} />
      </button>
    </div>
  </div>
);

// --- الصفحة الرئيسية ---

export default function GalaxyHome() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* قائمة الفئات */}
      <div className="bg-white py-4 border-b border-gray-50 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex gap-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 flex-shrink-0">
            Home Appliances <ChevronDown size={14}/>
          </button>
          {CATEGORIES.map((cat, i) => (
            <button key={i} className="border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition flex-shrink-0 flex items-center gap-2">
              {cat} <ChevronDown size={14} className="text-blue-400"/>
            </button>
          ))}
        </div>
      </div>

      <main className="pb-20">
        {/* السلايدر المتحرك */}
        <Hero />

        {/* قسم المنتجات الشائعة */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Popular Items</h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
            </div>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All Deals <ChevronRight size={16}/>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>

      {/* زر الواتساب الثابت */}
      <a 
        href="https://wa.me/2126XXXXXXXX" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Order via WhatsApp
        </span>
        <Phone size={24} />
      </a>
    </div>
  );
}