import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Building } from 'lucide-react';
import { isAuthenticated, getStoredUser, removeStoredUser, authAPI } from '../services/api';
import AuthModal from './AuthModal';
import GetStartedModal from './GetStartedModal';
import VendorApplicationModal from './VendorApplicationModal';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isVendorApplicationModalOpen, setIsVendorApplicationModalOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated();
    const user = getStoredUser();
    setIsUserAuthenticated(authenticated);
    setCurrentUser(user);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    ...(isUserAuthenticated ? [{ id: 'dashboard', label: 'Dashboard' }] : []),
    // Only show "Become a Vendor" for non-authenticated users
    ...(!isUserAuthenticated ? [{ id: 'vendor', label: 'Become a Vendor', isButton: true }] : []),
    ...(!isUserAuthenticated ? [{ id: 'admin', label: 'Admin' }] : []),
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    removeStoredUser();
    authAPI.logout();
    checkAuthStatus();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <span className="text-2xl font-bold text-gray-900">Ayojok</span>
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isButton ? (
                <button
                  key={item.id}
                  onClick={() => setIsVendorApplicationModalOpen(true)}
                  className="flex items-center space-x-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Building className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                    currentPage === item.id ? 'text-pink-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isUserAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {currentUser?.name || 'User'}!
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setGetStartedModalOpen(true)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              item.isButton ? (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsVendorApplicationModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                >
                  <Building className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="pt-4 pb-2 space-y-2">
              {isUserAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Welcome, {currentUser?.name || 'User'}!
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setGetStartedModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onAuthSuccess={checkAuthStatus}
      />

      <GetStartedModal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
        onAuthSuccess={checkAuthStatus}
      />

      <VendorApplicationModal
        isOpen={isVendorApplicationModalOpen}
        onClose={() => setIsVendorApplicationModalOpen(false)}
      />
    </header>
  );
};

export default Header;