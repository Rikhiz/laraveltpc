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
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Admin Logo" className="w-25 h-auto" style={{ width: "100px", height: "auto" }} />
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[#F2F2F2] text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className={`bg-[#0D0C0C]/50 border rounded-md p-3 text-[#F2F2F2] text-base outline-none transition-colors ${
              errors.email ? "border-red-500" : "border-[#69747C]"
            } focus:border-[#FF2146]`}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />
          {errors.email && <InputError message={errors.email} className="text-red-400 text-sm" />}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-[#F2F2F2] text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className={`bg-[#0D0C0C]/50 border rounded-md p-3 pr-10 text-[#F2F2F2] text-base outline-none transition-colors w-full ${
                errors.password ? "border-red-500" : "border-[#69747C]"
              } focus:border-[#FF2146]`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#69747C] hover:text-[#F2F2F2]"
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
            className="w-4 h-4 text-[#FF2146] bg-[#0D0C0C]/50 border-[#69747C] rounded focus:ring-[#F2AF29] focus:ring-2"
          />
          <label htmlFor="remember" className="text-[#F2F2F2] text-sm">
            Remember me
          </label>
        </div>

        {/* General Error */}
        {(errors.email || errors.password) && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/50 rounded-md p-2">
            Please check your credentials and try again.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={processing}
          className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 disabled:from-[#69747C] disabled:to-[#69747C] text-[#F2F2F2] font-semibold rounded-md p-3 text-base transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed"
        >
          {processing ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-md">
        <p className="text-[#69747C] text-sm mb-2">Login Information:</p>
        <div className="text-[#F2F2F2] text-xs space-y-1">
          <p>Use your registered account credentials</p>
          <p>Contact admin if you forgot your password</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
