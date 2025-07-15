import React from 'react';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from '@/assets/hero-tech.png';
import CountUp from 'react-countup';

export const Hero = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload and share your images in seconds with our optimized infrastructure"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your images are protected with enterprise-grade security and 99.9% uptime"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Fast delivery worldwide with our distributed content delivery network"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pt-3">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="https://kauizhaotan.oss-cn-shanghai.aliyuncs.com/PhotoOmmit/1752543698991-gwmm8g.png" 
          alt="Tech Background" 
          className="w-full h-full object-cover blur-xs md:blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-cyber opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Title */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/20 backdrop-blur-md rounded-full border border-primary/30">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">Next-Gen Image Hosting</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Share Images
              <br />
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                At Light Speed
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The most advanced image hosting platform. Upload, generate instant links, 
              and share your visuals with the world in seconds.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* 辉光流动按钮 */}
            <div className="relative group flex items-center justify-center">
              <div className="
                absolute
                -inset-0.5 blur-sm opacity-40
                md:-inset-1.5 md:blur-lg md:opacity-80
                group-hover:opacity-100 transition duration-500 group-hover:duration-200
                will-change-filter overflow-hidden animate-glow-border bg-gradient-to-r from-primary via-primary-glow to-secondary
              " />
              <button
                onClick={scrollToUpload}
                className="relative z-10 h-14 md:h-16 rounded-lg px-10 text-base md:text-lg font-bold bg-background/60 backdrop-blur-md border border-white text-foreground flex flex-row items-center justify-center gap-2 shadow-lg group-hover:scale-105 transition duration-300 overflow-hidden whitespace-nowrap"
              >
                <span>Start Uploading</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
              </button>
            </div>
            {/* 文档按钮保持原样 */}
            <a
              href="https://github.com/TanYongF/iimage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="glass" size="xl" asChild>
                <span>View Documentation</span>
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-2 mt-6">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                <CountUp end={99.9} duration={2} decimals={1} suffix="%" />
              </div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center space-y-2 mt-6">
              <div className="text-3xl md:text-4xl font-bold text-secondary">
                <CountUp end={10000000} duration={2} separator="," suffix="+" />
              </div>
              <div className="text-muted-foreground">Images Hosted</div>
            </div>
            <div className="text-center space-y-2 mt-6">
              <div className="text-3xl md:text-4xl font-bold text-accent">
                {'<'}<CountUp start={10} end={1} duration={2} decimals={1} suffix="s" />
              </div>
              <div className="text-muted-foreground">Average Upload</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-24">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose iimage?
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for developers, creators, and businesses who demand the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 bg-card/30 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:animate-float">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};