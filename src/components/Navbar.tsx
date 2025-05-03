import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { searchRestaurants } from '../lib/restaurants';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setIsSearching(true);
      try {
        const results = await searchRestaurants(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching restaurants:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderProfileMenu = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <Link
          to="/admin"
          className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
        >
          Admin Dashboard
        </Link>
      );
    } else if (user.role === 'restaurant_owner') {
      return (
        <>
          <Link
            to="/owner/dashboard"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Owner Dashboard
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Profile
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/profile"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Profile
          </Link>
          <Link
            to="/my-reviews"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            My Reviews
          </Link>
          <Link
            to="/saved-restaurants"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Saved Restaurants
          </Link>
          <Link
            to="/favorites"
            className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Favorites
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-primary-500 font-display font-bold text-2xl md:text-3xl">
              Yummy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/restaurants" className="text-neutral-600 hover:text-primary-500 transition-colors">
              Restaurants
            </Link>
            <Link to="/about" className="text-neutral-600 hover:text-primary-500 transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search restaurants..."
                className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <Search className="h-5 w-5" />
              </button>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      to={`/restaurant/${result.id}`}
                      className="block px-4 py-2 hover:bg-neutral-50"
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <div className="font-medium text-neutral-900">{result.name}</div>
                      <div className="text-sm text-neutral-500">{result.cuisine} • {result.location}</div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative flex items-center space-x-4">
                <NotificationBell />
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-primary-600">
                      {user.firstName[0]}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 top-full">
                    {renderProfileMenu()}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neutral-600 hover:text-neutral-900"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search restaurants..."
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-neutral-600 hover:text-primary-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/restaurants"
                  className="text-neutral-600 hover:text-primary-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  to="/about"
                  className="text-neutral-600 hover:text-primary-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {/* Mobile User Menu */}
              {user ? (
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary-600">
                        {user.firstName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-neutral-500">{user.email}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : user.role === 'restaurant_owner' ? (
                      <>
                        <Link
                          to="/owner/dashboard"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Owner Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/my-reviews"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Reviews
                        </Link>
                        <Link
                          to="/saved-restaurants"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Saved Restaurants
                        </Link>
                        <Link
                          to="/favorites"
                          className="block text-neutral-600 hover:text-primary-500 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Favorites
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors py-2 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <Link
                    to="/login"
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-center block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;