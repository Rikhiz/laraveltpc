import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import logo from "../images/test.png";
import { router } from "@inertiajs/react";
import LoginModal from "@/Components/LoginModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { label: "LEADERBOARD", href: "/leaderboards" },
    { label: "TOURNAMENTS", href: "/tournaments" },
    { label: "GALLERY", href: "/gallery" },
    { label: "ABOUT", href: "/about" },
  ];

  const handleNavigation = (href) => {
    router.visit(href);
  };

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50); // Threshold 50px
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup listener saat component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav 
        className={`
          sticky top-0 z-50 transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'bg-[#0D0C0C]/95 backdrop-blur-md shadow-lg border-b border-[#FF2146]/20' 
            : 'bg-gradient-to-b from-[#0D0C0C] to-[#0D0C0C]/95'
          }
        `}
      >
        <div 
          className={`
            max-w-7xl mx-auto flex items-center justify-between transition-all duration-300
            ${isScrolled ? 'px-6 py-2' : 'p-4'}
          `}
        >
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigation("/")}
              className="text-white hover:scale-110 transition-all duration-300 hover:drop-shadow-lg"
            >
              <img 
                src={logo} 
                alt="Logo" 
                className={`
                  transition-all duration-300 hover:brightness-110
                  ${isScrolled ? 'size-14' : 'size-20'}
                `} 
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`
                  relative text-[#F2F2F2] hover:text-[#FF2146] transition-all duration-300 font-black
                  ${isScrolled ? 'text-lg' : 'text-xl'}
                  before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-0 before:left-0 
                  before:bg-gradient-to-r before:from-[#FF2146] before:to-[#F2AF29]
                  hover:before:w-full before:transition-all before:duration-300
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Sign In */}
          <button
            onClick={() => setShowLoginModal(true)}
            className={`
              hidden md:block bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] rounded-lg 
              hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 hover:shadow-lg hover:scale-105
              transition-all duration-300 font-bold relative overflow-hidden group
              ${isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-2.5 text-base'}
            `}
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              md:hidden text-[#F2F2F2] hover:text-[#FF2146] transition-all duration-300 p-2 rounded-lg
              hover:bg-[#FF2146]/10 border border-transparent hover:border-[#FF2146]/30
            `}
          >
            <Menu size={isScrolled ? 20 : 24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0D0C0C]/98 backdrop-blur-md border-t border-[#FF2146]/20">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    handleNavigation(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    block w-full text-left text-[#F2F2F2] hover:text-[#FF2146] hover:bg-[#FF2146]/10
                    transition-all duration-300 font-bold text-lg py-3 px-4 rounded-lg
                    border border-transparent hover:border-[#FF2146]/20
                  `}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  block w-full bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] 
                  px-4 py-3 rounded-lg hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 
                  hover:shadow-lg transition-all duration-300 mt-4 font-bold
                  relative overflow-hidden group
                `}
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Reusable Login Modal */}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Header;