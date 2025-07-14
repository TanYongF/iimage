import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Copy, Check, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToOSS } from '@/api/image';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  uploadedAt: Date;
}

interface LinkType {
  label: string;
  value: string;
  format: string;
}

export const ImageUploader = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only image files.",
        variant: "destructive"
      });
      return;
    }
    for (const file of imageFiles) {
      try {
        const { url, fileName } = await uploadImageToOSS(file);
        const newImage: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          file: new File([file], fileName, { type: file.type }),
          url,
          uploadedAt: new Date()
        };
        setUploadedImages(prev => [newImage, ...prev]);
        toast({
          title: "Image uploaded successfully!",
          description: `${file.name} has been uploaded.`
        });
      } catch (err: any) {
        toast({
          title: "Upload failed",
          description: err?.message || 'Failed to upload image.',
          variant: "destructive"
        });
      }
    }
  };

  // 粘贴图片上传
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        handleFiles(files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const getLinksForImage = (image: UploadedImage): LinkType[] => {
    const baseUrl = image.url;
    const fileName = image.file.name;
    return [
      {
        label: "Direct Link",
        value: baseUrl,
        format: "URL"
      },
      {
        label: "HTML Code",
        value: `<img src=\"${baseUrl}\" alt=\"${fileName}\" />`,
        format: "HTML"
      },
      {
        label: "Markdown",
        value: `![${fileName}](${baseUrl})`,
        format: "MD"
      }
    ];
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLinks(prev => new Set([...prev, linkId]));
      toast({
        title: "Link copied!",
        description: "Link has been copied to clipboard."
      });
      
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(linkId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
    
    toast({
      title: "Image removed",
      description: "Image has been removed from your uploads."
    });
  };

  const clearAllImages = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    toast({
      title: "All images removed",
      description: "All uploaded images have been cleared."
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Area */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cyber opacity-5"></div>
        <div
          className={`relative p-12 border-2 border-dashed transition-all duration-300 ${
            dragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Drop your images here</h3>
              <p className="text-muted-foreground">
                or{' '}
                <span className="text-primary font-semibold hover:text-primary-glow transition-colors cursor-pointer">Browse files</span>
              </p>
              <p className="text-muted-foreground">
                or{' '}
                <span className="text-primary font-semibold">Ctrl+V to paste images</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-muted rounded-full">JPG</span>
              <span className="px-3 py-1 bg-muted rounded-full">PNG</span>
              <span className="px-3 py-1 bg-muted rounded-full">GIF</span>
              <span className="px-3 py-1 bg-muted rounded-full">WebP</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Your Uploads ({uploadedImages.length})
            </h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllImages}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
          
          <div className="grid gap-6">
            {uploadedImages.map((image) => {
              const links = getLinksForImage(image);
              
              return (
                <Card key={image.id} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-slide-up">
                  <div className="space-y-4">
                    {/* Image Header */}
                    <div className="flex items-start gap-4">
                      <img
                        src={image.url}
                        alt={image.file.name}
                        className="w-20 h-20 object-cover rounded-lg border border-primary/20 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">
                            {image.file.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                            className="shrink-0 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {image.uploadedAt.toLocaleString()}
                        </p>
                        
                        <div className="text-xs text-muted-foreground">
                          Size: {(image.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gradient-primary rounded-full"></div>
                        <h5 className="font-medium text-foreground">Share Links</h5>
                      </div>
                      
                      <div className="grid gap-3">
                        {links.map((link, index) => {
                          const linkId = `${image.id}-${index}`;
                          const isCopied = copiedLinks.has(linkId);
                          
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground">
                                    {link.label}
                                  </span>
                                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                    {link.format}
                                  </span>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(link.value, linkId)}
                                  className="shrink-0 h-8 w-8 p-0"
                                >
                                  {isCopied ? (
                                    <Check className="w-4 h-4 text-accent" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              
                              <div className="relative">
                                <code className="block w-full px-3 py-2 bg-muted rounded-lg text-xs text-muted-foreground break-all overflow-hidden">
                                  {link.value}
                                </code>
                                {/* Gradient overlay for long text */}
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted to-transparent pointer-events-none"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};