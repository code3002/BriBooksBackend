import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                BriBooks<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Empowering young minds to write, publish, and sell their own books globally.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/start-writing" className="hover:text-primary transition-colors">Write a Book</Link></li>
                            <li><Link to="/books" className="hover:text-primary transition-colors">Browse Books</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">My Dashboard</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900 mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary transition-all">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} BriBooks. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
