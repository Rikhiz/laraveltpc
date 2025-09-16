  // resources/js/Components/LoginModal.jsx
  import React, { useState } from "react";
  import { Eye, EyeOff } from "lucide-react";
  import { useForm } from "@inertiajs/react";
  import Modal from "@/Components/Modal";
  import InputError from "@/Components/InputError";
  import logo from "../images/test.png";

  const LoginModal = ({ show, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
      email: "",
      password: "",
      remember: false,
    });

    const handleLogin = (e) => {
      e.preventDefault();

      const loginUrl = window.route ? route("login") : "/login";

      post(loginUrl, {
        onSuccess: () => {
          onClose();
          reset("password");
        },
        onError: () => {
          console.log("Login failed:", errors);
        },
        onFinish: () => {
          reset("password");
        },
      });
    };

    return (
      <Modal title="Login" show={show} onClose={() => { reset(); onClose(); }}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Admin Logo" className="w-25 h-auto" style={{ width: "100px", height: "auto" }} />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className={`bg-gray-800 border rounded-md p-3 text-white text-base outline-none transition-colors ${
                errors.email ? "border-red-500" : data.email ? "border-red-400" : "border-gray-600"
              } focus:border-red-500`}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
            {errors.email && <InputError message={errors.email} className="text-red-400 text-sm" />}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className={`bg-gray-800 border rounded-md p-3 pr-10 text-white text-base outline-none transition-colors w-full ${
                  errors.password ? "border-red-500" : data.password ? "border-red-400" : "border-gray-600"
                } focus:border-red-500`}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <InputError message={errors.password} className="text-red-400 text-sm" />}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <label htmlFor="remember" className="text-white text-sm">
              Remember me
            </label>
          </div>

          {/* General Error */}
          {(errors.email || errors.password) && (
            <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-30 border border-red-500 rounded-md p-2">
              Please check your credentials and try again.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={processing}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white border-none rounded-md p-3 text-base font-semibold cursor-pointer transition-colors"
          >
            {processing ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Info */}
        <div className="mt-4 p-4 bg-gray-800 rounded-md">
          <p className="text-gray-400 text-sm mb-2">Login Information:</p>
          <div className="text-gray-300 text-xs">
            <p>Use your registered account credentials</p>
            <p>Contact admin if you forgot your password</p>
          </div>
        </div>
      </Modal>
    );
  };

  export default LoginModal;
