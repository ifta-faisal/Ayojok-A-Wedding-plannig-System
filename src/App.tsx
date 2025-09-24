import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import AuthModal from './components/AuthModal';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleOpenAuthModal = () => {
    console.log('handleOpenAuthModal called!');
    setAuthMode('signin');
    setAuthModalOpen(true);
    console.log('Auth modal should now be open');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'pricing':
        return <Pricing setCurrentPage={setCurrentPage} />;
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return <Contact />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <Admin />;

      default:
        return (
          <>
            <Hero setCurrentPage={setCurrentPage} onOpenAuthModal={handleOpenAuthModal} />
            <Features />
            <Services />
            <Pricing setCurrentPage={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'admin' ? (
        renderPage()
      ) : (
        <>
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main>
            {renderPage()}
          </main>
          <Footer setCurrentPage={setCurrentPage} />
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onAuthSuccess={() => {
          // Handle successful authentication
          console.log('Authentication successful');
        }}
      />
    </div>
  );
}

export default App;