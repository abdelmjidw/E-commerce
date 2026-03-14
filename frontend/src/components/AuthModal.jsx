import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Loader2, X } from "lucide-react";
import API from "../api/api"; // Import the axios instance
import toast from "react-hot-toast";

function AuthModal() {
  const { showLogin, closeLogin, login: setAuthStatus } = useAuth();
  const navigate = useNavigate();

  // Component States
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!showLogin) return null;

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

if (!isLogin && formData.password !== formData.confirmPassword) {
  toast.error("Passwords do not match!");
  setLoading(false);
  return;
}

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      // Axios automatically stringifies the object to JSON
      const response = await API.post(endpoint, formData);

      // In Axios, the server response is inside the 'data' property
      const data = response.data;

      if (isLogin) {
        // Success Login logic
        setAuthStatus(data.user, data.token);
          toast.success("Login successful!");
        // Role-based Redirection
        if (data.user.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        closeLogin();
      } else {
        // Success Registration logic
        toast.success("Account created successfully! Please sign in.");
        setIsLogin(true); 
      }
    } catch (err) {
      // Axios handles errors differently: server messages are in err.response.data
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-[450px] md:max-w-[850px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Close Button */}
        <button 
          onClick={closeLogin} 
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Left Side: Brand Identity */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 p-12 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-900 rounded-full blur-3xl"></div>
          </div>
          
          <div className="z-10 text-center">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
              {isLogin ? "Welcome Back!" : "Galaxy Digital"}
            </h2>
            <p className="text-lg text-blue-50 leading-relaxed opacity-90">
              {isLogin 
                ? "Sign in to manage your orders and explore the latest tech in Agadir." 
                : "Create an account to join the largest electronics community in Morocco."}
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Sign In" : "Register"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin ? "Please enter your details to login" : "Start your journey with us today"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium animate-bounce">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="name"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-gray-700">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already a member?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {isLogin ? "Register now" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;