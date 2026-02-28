import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
// If you don't have these icons, you can remove them or use text
import { Mail, Lock, User as UserIcon } from "lucide-react"; 

function AuthModal() {
  const { showLogin, closeLogin } = useAuth();
  
  // State to toggle between Login and Register forms
  const [isLogin, setIsLogin] = useState(true);

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[450px] md:max-w-[850px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Close Button */}
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl z-10 transition-colors"
        >
          ✕
        </button>

        {/* Left Side – Brand / Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-700 to-cyan-500 p-10 text-white relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"></div>
          
          <div className="z-10 text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              {isLogin ? "Welcome Back!" : "Join Us!"}
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              {isLogin 
                ? "Sign in to access your orders, saved items, and exclusive Agadir deals." 
                : "Create an account to shop the best electronics and home appliances in Morocco."}
            </p>
          </div>
        </div>

        {/* Right Side – Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-1">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            {isLogin ? "Access your Galaxy Digital account" : "Join our e-commerce platform"}
          </p>

          {/* Social Sign Up/In */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-medium transition">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 brightness-0 invert" />
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">or email</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Input Form */}
          <form className="flex flex-col gap-4 flex-1">
            
            {/* Show Full Name only if Registering */}
            {!isLogin && (
              <div className="flex flex-col relative">
                <label className="font-semibold text-gray-700 text-sm mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col relative">
              <label className="font-semibold text-gray-700 text-sm mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col relative">
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-gray-700 text-sm">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            {!isLogin && (
              <div className="flex flex-col relative">
                <label className="font-semibold text-gray-700 text-sm mb-1">Confirm Password</label>
                <div className="relative"> 
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"  
                    /></div>
              </div>
            )}         

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all mt-4 shadow-lg shadow-blue-600/30">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-600 font-bold hover:underline focus:outline-none"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthModal;