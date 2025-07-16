import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginApi } from "./login";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState("password");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, authMethod });
    try {
      const data =
        authMethod === "password" ? { email, password } : { email, otp };

      const response = await loginApi(data);
      console.log("data", response);
      if (response.success) {
        localStorage.setItem("UserName", response?.user?.name);
        localStorage.setItem("email", response?.user?.email);
        localStorage.setItem("mobile", response?.user?.mobile);
        localStorage.setItem("user_id", response?.user?.id);
        localStorage.setItem("token", response?.spree_api_key);
        localStorage.setItem("role_id", response?.user?.role?.id);
        localStorage.setItem("role_for", response?.user?.role?.display_name);
        localStorage.setItem("roles", response?.user?.role?.permissions_hash);
        localStorage.setItem("department", response?.user?.department);

        toast.success("Signed In Successfully!", {
          position: "top-center",
        });
        navigate("/setup");
      } else {
        toast.error(response.message || "Login failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid Credentials", {
        position: "top-center",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/login_bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-800/30 to-transparent"></div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-xl">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-6 px-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col items-center">
                <div className="flex space-x-1 mb-10">
                  <img
                    src="https://marathon.in/wp-content/uploads/2018/12/marathon-logo_500px.png"
                    alt="Marathon Logo"
                    className="w-80 h-auto"
                  />
                </div>
              </div>
            </div>
            <h2 className="text-2xl px-5 flex font-semibold text-gray-800 my-3 mb-2">
              Welcome,
            </h2>
            <p className="flex px-5 text-gray-600">Login to continue</p>
          </div>

          {/* Auth Method Selection - Fixed Radio Buttons */}
          <div className="mb-2 px-10">
            <div className="flex space-x-6">
              {/* Password Option */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="authMethod"
                  value="password"
                  checked={authMethod === "password"}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-4 flex items-center justify-center
          ${
            authMethod === "password"
              ? "border-blue-300 bg-red-800"
              : "border-gray-300 bg-gray-100"
          }`}
                >
                  {authMethod === "password" && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </span>
                <span className="text-gray-500 font-medium">Password</span>
              </label>

              {/* OTP Option */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="authMethod"
                  value="otp"
                  checked={authMethod === "otp"}
                  onChange={(e) => setOtp(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-4 flex items-center justify-center
          ${
            authMethod === "otp"
              ? "border-blue-300 bg-red-800"
              : "border-gray-300 bg-gray-100"
          }`}
                >
                  {authMethod === "otp" && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </span>
                <span className="text-gray-500 font-medium">OTP</span>
              </label>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 px-10">
            {/* Email Field */}
            <div className="">
              <label htmlFor="email" className="text-gray-700 font-bold">
                Login
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email/phone/username"
                className="w-full px-4 py-3   bg-white border border-gray-400 rounded focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password/OTP Field */}
            {authMethod === "password" ? (
              <div className="">
                <label htmlFor="password" className="text-gray-700 font-bold">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-400 rounded focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-red-700 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="otp" className="text-gray-700 font-medium">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 bg-yellow-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                  maxLength={6}
                />
                <div className="text-right">
                  <button
                    type="button"
                    className="text-red-700 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-red-800 hover:bg-red-900 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button className="text-red-700 hover:text-red-800 font-medium transition-colors">
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
