import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-primary-500 font-display font-bold text-2xl md:text-3xl">
                Yummy
              </span>
            </Link>
            <p className="text-neutral-300 mb-4">
              Discover the best local flavors in Addis Ababa. Your trusted guide to Ethiopia's vibrant culinary scene.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-neutral-300 hover:text-primary-500 transition-colors">Restaurants</Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-primary-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-primary-500 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-300 hover:text-primary-500 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Cuisines */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Cuisines</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants?cuisine=Traditional Ethiopian" className="text-neutral-300 hover:text-primary-500 transition-colors">Ethiopian</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Italian" className="text-neutral-300 hover:text-primary-500 transition-colors">Italian</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Middle Eastern" className="text-neutral-300 hover:text-primary-500 transition-colors">Middle Eastern</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Continental" className="text-neutral-300 hover:text-primary-500 transition-colors">Continental</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=International" className="text-neutral-300 hover:text-primary-500 transition-colors">International</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300">Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-neutral-300">+251 11 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-neutral-300">info@yummy-addis.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} Yummy. All rights reserved.
          </p>
          <p className="text-neutral-400 text-sm mt-2 md:mt-0">
            Designed with ❤️ in Addis Ababa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;