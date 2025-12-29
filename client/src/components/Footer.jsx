import { Link } from 'react-router-dom';
import { Store, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold flex items-center gap-2">
              <Store className="text-primary-500" />
              BuildOwn
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Your premium destination for high-performance PC hardware. We help you build your dream machine with the best components in the market.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-primary-500 transition-colors flex items-center gap-2">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-primary-500 transition-colors flex items-center gap-2">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-primary-500 transition-colors flex items-center gap-2">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors flex items-center gap-2">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shipping" className="hover:text-primary-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-primary-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-primary-500 transition-colors">FAQs</Link></li>
              <li><Link to="/profile" className="hover:text-primary-500 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="text-primary-500 font-medium">Email:</span>
                <span className="text-gray-400">support@buildown.com</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-500 font-medium">Phone:</span>
                <span className="text-gray-400">+91 1234567890</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-500 font-medium">Address:</span>
                <span className="text-gray-400">Tech Hub, Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BuildOwn. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-rose-500 fill-current" /> for Builders
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
