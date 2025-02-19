"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { handleLogin } from "@/lib/loginServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError("");

    const validationErrors = {};
    if (!username) validationErrors.username = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    if (!captchaValue) validationErrors.captcha = "Please complete the CAPTCHA";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!validateCaptcha(captchaValue)) {
      setCaptchaError(true);
      return;
    }

    try {
      const result = await handleLogin(e, { username, password });
      if (result) {
        const { isAdmin, client } = result;
        toast.success("Login successful! Redirecting...");
        router.push(
          isAdmin
            ? `/admin?username=${client.username}`
            : `/client?username=${client.username}`,
        );
      } else {
        toast.error("Invalid credentials or server error. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-800 to-purple-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Welcome to PayFlow
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Securely manage your payments
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-gray-500"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Enter CAPTCHA</label>
            <LoadCanvasTemplate />
            <input
              type="text"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Enter CAPTCHA"
            />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
