import React from 'react';
import { Upload, Github, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose
} from '@/components/ui/drawer';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export const Navbar = () => {
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer select-none" tabIndex={0} aria-label="Go to home">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">iimage</span>
              <span className="text-xs text-muted-foreground">Image Platform</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              首页
            </Link>
            <Link to="/mcp" className="text-foreground hover:text-primary transition-colors">
              MCP协议
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="glass"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <a
                href="https://github.com/TanYongF/iimage"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>

            <Button
              variant="cyber"
              size="sm"
              onClick={() => {
                const el = document.getElementById('upload-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started
            </Button>

            {/* Mobile Menu Button & Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="md:hidden px-6 pb-8 pt-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-foreground">iimage</span>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" ref={drawerCloseRef}>
                      <X className="w-5 h-5" />
                    </Button>
                  </DrawerClose>
                </div>
                <div className="flex flex-col gap-6 text-lg">
                  <Link
                    to="/"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={e => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      drawerCloseRef.current?.click();
                      window.location.href = '/';
                    }}
                  >
                    首页
                  </Link>
                  <Link
                    to="/mcp"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={e => {
                      e.preventDefault();
                      drawerCloseRef.current?.click();
                      window.location.href = '/mcp';
                    }}
                  >
                    MCP协议
                  </Link>
                  <Link
                    to="/about"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={e => {
                      e.preventDefault();
                      drawerCloseRef.current?.click();
                      window.location.href = '/about';
                    }}
                  >
                    About
                  </Link>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};