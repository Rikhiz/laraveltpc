import React from 'react';
import Header from '@/Components/Header'; // Sesuaikan path dengan struktur project Anda
import Footer from '@/Components/Footer';

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            
            <main className="flex-1">
                {children}
            </main>
             <Footer />
        </div>
    );
};

export default AppLayout;