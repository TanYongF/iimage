import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ImageUploader } from '@/components/ImageUploader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Upload Section */}
      <section id="upload-section" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Upload Your Images
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images, click to browse, <span className="text-primary font-semibold">or use Ctrl+V to paste images</span>. Get instant shareable links.
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/20 backdrop-blur-md py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">T</span>
              </div>
              <span className="text-lg font-semibold text-foreground">iimage</span>
            </div>
            
            <p className="text-muted-foreground">
              Next-generation image hosting platform for the modern web
            </p>
            
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © 2025 iimage. Built with cutting-edge technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
