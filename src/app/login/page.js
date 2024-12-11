"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha"; // Import react-simple-captcha
import { handleLogin } from "@/lib/loginServices";

// Import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  // Directly call useRouter here
  const router = useRouter();

  useEffect(() => {
    loadCaptchaEnginge(6); // Initialize captcha engine
  }, []);

  const handleCaptcha = (value) => {
    setCaptchaValue(value);
    setCaptchaError(false);
  };

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

    const loginData = { username, password };

    try {
      const result = await handleLogin(e, loginData);

      if (result) {
        const { isAdmin, client } = result;
        console.log("IS ADMIN : ", isAdmin);
        if (isAdmin) {
          console.log("Redirecting to Admin Dashboard...");
          router.push(`/admin`);
          // Show success toast on successful login
          toast.success("Login successful! Redirecting to Admin Dashboard...");
        } else {
          console.log("Redirecting to Client Dashboard...");
          router.push(`/client`);
          // Show success toast on successful login
          toast.success("Login successful! Redirecting to Client Dashboard...");
        }
      } else {
        setLoginError("Invalid credentials or server error. Please try again.");
        // Show error toast if login failed
        toast.error("Invalid credentials or server error. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("An error occurred. Please try again.");
      // Show error toast if there is an error during login
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSignupRoute = () => {
    router.push("/sign-up");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">PayFlow</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage Your Payments with Ease
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900 bg-white"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900 bg-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-sm text-gray-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* CAPTCHA Section */}
          <div className="mb-6">
            <label
              htmlFor="captcha"
              className="block text-sm font-medium text-gray-700"
            >
              Enter CAPTCHA
            </label>
            <LoadCanvasTemplate />
            <input
              type="text"
              id="captcha"
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900 bg-white"
              value={captchaValue}
              onChange={(e) => handleCaptcha(e.target.value)}
              placeholder="Enter the captcha"
            />
            {captchaError && (
              <p className="text-sm text-red-500 mt-1">
                Captcha is incorrect. Please try again.
              </p>
            )}
            {errors.captcha && (
              <p className="text-sm text-red-500 mt-1">{errors.captcha}</p>
            )}
          </div>

          {/* Error Message from backend */}
          {loginError && (
            <div className="text-sm text-red-500 mb-4">{loginError}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-300"
          >
            Login
          </button>
        </form>

        {/* Updated Link with Visible Color */}
        <div className="text-center mt-6 text-sm">
          <p className="text-black">
            Don’t have an account?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:underline"
              onClick={handleSignupRoute}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
