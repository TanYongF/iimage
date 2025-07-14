import React from "react";
import { Navbar } from '@/components/Navbar';
import { Users, Mail, Github as GithubIcon, Layers, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const team = [
  { name: 'AI Tools - Lovable', role: 'Frontend' },
  { name: 'AI Tools - Cursor', role: 'Frontend & Backend' },
  { name: 'My own - Tans', role: 'Product Design & DevOps' },
];

const techStack = [
  'Frontend: React, Tailwind CSS, Vite',
  'Backend: Node.js, Express',
  'Cloud Storage: OSS',
  'CI/CD: GitHub Actions, Docker',
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Info className="w-4 h-4" />
            About iimage
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              iimage
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            iimage is a modern image hosting platform designed for developers and teams. It provides fast, secure, and reliable image upload and management, supporting advanced protocols like MCP.
          </p>
        </div>

        {/* Team Section */}
        <Card className="mb-10 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground pl-2">
              {team.map((member, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-medium text-foreground">{member.name}</span> — {member.role}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-10 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <span>Email: support@iimage.com</span>
              <span className="flex items-center gap-1">
                <GithubIcon className="w-4 h-4" />
                <a href="https://github.com/tans-dev/iimage" className="text-primary underline" target="_blank" rel="noopener noreferrer">tans-dev/iimage</a>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Section */}
        <Card className="mb-10 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground pl-2">
              {techStack.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Thanks Section */}
        <div className="text-center text-muted-foreground mt-8 text-base">
          Special thanks to the AI era for inspiration and support!
        </div>
      </div>
    </div>
  </div>
);

export default About; 