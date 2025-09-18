import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import TypingEffect from "@/Components/TypingEffect";
import { Trophy, Users, TrendingUp, Calendar, Gamepad2, Star } from "lucide-react";
import tkchar from "@/images/tkchar.png"
import herobg from "@/images/hero-background.jpg"

const Welcome = () => {
    const [leaderboardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const itemsPerPage = 16;

    const pageCount = Math.ceil(leaderboardData.length / itemsPerPage);

    // Animation trigger
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: Trophy,
            title: "Live Tournaments",
            description: "Join active tournaments and compete with players worldwide",
            gradient: "from-[#F2AF29] to-[#FF2146]"
        },
        {
            icon: Users,
            title: "Community",
            description: "Connect with gamers and build your network",
            gradient: "from-[#FF2146] to-[#69747C]"
        },
        {
            icon: TrendingUp,
            title: "Rankings",
            description: "Track your progress and climb the leaderboards",
            gradient: "from-[#69747C] to-[#F2AF29]"
        }
    ];

    const stats = [
        { value: "10K+", label: "Active Players" },
        { value: "500+", label: "Tournaments" },
        { value: "$50K", label: "Prize Pool" },
        { value: "24/7", label: "Support" }
    ];

    const news = [
        {
            title: "Tournament Season 2 Begins!",
            description: "Registration is now open for the upcoming season with bigger prizes",
            date: "2 days ago",
            type: "Tournament"
        },
        {
            title: "New Gaming Categories Added",
            description: "Explore new competitive gaming options including mobile esports",
            date: "1 week ago",
            type: "Update"
        },
        {
            title: "Championship Finals Live",
            description: "Watch the epic showdown between top players this weekend",
            date: "3 days ago",
            type: "Event"
        }
    ];

    return (
        <AppLayout>
            {/* Hero Section with Full Screen */}
            <div className="relative h-screen overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={herobg} 
                        alt="Hero Background" 
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay with TPC colors */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C0C]/80 via-[#0D0C0C]/60 to-[#0D0C0C]/90"></div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF2146]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F2AF29]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FF2146]/5 to-transparent rounded-full"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between h-full gap-8 lg:gap-12">
                        {/* Left Content - Takes more space on desktop */}
                        <div className={`w-full lg:w-3/5 xl:w-2/3 space-y-6 lg:space-y-8 text-center lg:text-left transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white">
                                    <TypingEffect
                                        text={`Welcome to <span class="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">Tournament Portal</span>`}
                                        speed={80}
                                    />
                                </h1>
                                <p className="text-[#F2F2F2] text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                    Join thrilling competitions, connect with the community, and showcase your skills in the ultimate gaming arena.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="group relative px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                                    <Gamepad2 className="w-5 h-5 z-10" />
                                    <span className="z-10">Join Tournament</span>
                                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                                <button className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border-2 border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold rounded-xl transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29]">
                                    Learn More
                                </button>
                            </div>

                            {/* Stats - Hidden on mobile, shown on tablet+ */}
                            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6 lg:pt-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center lg:text-left space-y-1">
                                        <div className="text-xl lg:text-2xl xl:text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-[#69747C] text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image - Now positioned at the far right */}
                        <div className={`w-full lg:w-2/5 xl:w-1/3 flex justify-center lg:justify-end transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/20 to-[#F2AF29]/20 rounded-full blur-3xl transform scale-110"></div>
                                <img
                                    src={tkchar}
                                    alt="Tekken Character"
                                    className="relative w-48 md:w-64 lg:w-80 xl:w-96 max-w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Mobile Stats - Shown only on mobile */}
                        <div className="md:hidden grid grid-cols-2 gap-4 w-full pt-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center space-y-1">
                                    <div className="text-xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-[#69747C] text-xs">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-b from-[#0D0C0C] to-[#0D0C0C]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
                    {/* Latest Video Tournament Section */}
                    <div className="mb-16 lg:mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 lg:p-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-xl">
                                <Gamepad2 className="w-5 h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                            </div>
                            <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold">Latest Video Tournament</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {/* Video 1 */}
                            <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-105">
                                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                                    <img 
                                        src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                                        alt="Tournament Video"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-[#FF2146]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-0 h-0 border-l-[12px] border-l-[#F2F2F2] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[#F2F2F2] font-bold text-lg mb-2 group-hover:text-[#FF2146] transition-colors">
                                        TPC Championship Finals 2024
                                    </h3>
                                    <p className="text-[#69747C] text-sm leading-relaxed mb-3">
                                        Watch the epic showdown between top players in our biggest tournament yet
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[#69747C]">
                                        <span>2 days ago</span>
                                        <span>1.2K views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Video 2 */}
                            <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-105">
                                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                                    <img 
                                        src="https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg" 
                                        alt="Tournament Video"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-[#FF2146]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-0 h-0 border-l-[12px] border-l-[#F2F2F2] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[#F2F2F2] font-bold text-lg mb-2 group-hover:text-[#FF2146] transition-colors">
                                        Weekly Tournament Highlights
                                    </h3>
                                    <p className="text-[#69747C] text-sm leading-relaxed mb-3">
                                        Best moments from last week's community tournament battles
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[#69747C]">
                                        <span>1 week ago</span>
                                        <span>850 views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Video 3 */}
                            <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-105">
                                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                                    <img 
                                        src="https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg" 
                                        alt="Tournament Video"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-[#FF2146]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-0 h-0 border-l-[12px] border-l-[#F2F2F2] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[#F2F2F2] font-bold text-lg mb-2 group-hover:text-[#FF2146] transition-colors">
                                        Beginner Tournament Guide
                                    </h3>
                                    <p className="text-[#69747C] text-sm leading-relaxed mb-3">
                                        Learn the basics and strategies for your first tournament participation
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[#69747C]">
                                        <span>3 weeks ago</span>
                                        <span>2.1K views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Tournament Section */}
                    <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/5 to-[#F2AF29]/5"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                <div className="p-2 lg:p-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-xl">
                                    <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                                </div>
                                <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold">Latest Tournament</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                {/* Tournament Card 1 */}
                                <div className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#F2AF29]/20 text-[#F2AF29]">
                                                UPCOMING
                                            </span>
                                            <span className="text-[#69747C] text-sm">Dec 25, 2024</span>
                                        </div>
                                        
                                        <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors">
                                            TPC Winter Championship 2024
                                        </h3>
                                        
                                        <p className="text-[#69747C] leading-relaxed text-sm mb-4">
                                            The biggest tournament of the year featuring top players from across Pekanbaru. Register now to secure your spot!
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    Rp 5.000.000
                                                </div>
                                                <div className="text-[#69747C] text-xs">Prize Pool</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    32/64
                                                </div>
                                                <div className="text-[#69747C] text-xs">Participants</div>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                            Register Now
                                        </button>
                                    </div>
                                </div>

                                {/* Tournament Card 2 */}
                                <div className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#FF2146]/20 text-[#FF2146]">
                                                LIVE NOW
                                            </span>
                                            <span className="text-[#69747C] text-sm">Dec 15, 2024</span>
                                        </div>
                                        
                                        <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors">
                                            Weekly Community Tournament
                                        </h3>
                                        
                                        <p className="text-[#69747C] leading-relaxed text-sm mb-4">
                                            Join our weekly community tournament every Saturday. Perfect for beginners and experienced players alike.
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    Rp 500.000
                                                </div>
                                                <div className="text-[#69747C] text-xs">Prize Pool</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    16/16
                                                </div>
                                                <div className="text-[#69747C] text-xs">Participants</div>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#69747C]/50 to-[#69747C]/30 text-[#69747C] font-semibold rounded-lg cursor-not-allowed">
                                            Tournament Full
                                        </button>
                                    </div>
                                </div>

                                {/* Tournament Card 3 */}
                                <div className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#69747C]/20 text-[#69747C]">
                                                COMPLETED
                                            </span>
                                            <span className="text-[#69747C] text-sm">Dec 8, 2024</span>
                                        </div>
                                        
                                        <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors">
                                            TPC Monthly Championship
                                        </h3>
                                        
                                        <p className="text-[#69747C] leading-relaxed text-sm mb-4">
                                            Congratulations to all participants! Check out the highlights and prepare for next month's tournament.
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    Ahmad
                                                </div>
                                                <div className="text-[#69747C] text-xs">Winner</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    24/24
                                                </div>
                                                <div className="text-[#69747C] text-xs">Participants</div>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29]">
                                            View Results
                                        </button>
                                    </div>
                                </div>

                                {/* Tournament Card 4 */}
                                <div className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#F2AF29]/20 text-[#F2AF29]">
                                                REGISTRATION OPEN
                                            </span>
                                            <span className="text-[#69747C] text-sm">Jan 5, 2025</span>
                                        </div>
                                        
                                        <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors">
                                            New Year Championship 2025
                                        </h3>
                                        
                                        <p className="text-[#69747C] leading-relaxed text-sm mb-4">
                                            Start the new year with an epic tournament! Early bird registration now open with special discounts.
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    Rp 10.000.000
                                                </div>
                                                <div className="text-[#69747C] text-xs">Prize Pool</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                    12/128
                                                </div>
                                                <div className="text-[#69747C] text-xs">Participants</div>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                            Early Bird Registration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Welcome;