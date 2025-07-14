import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Code, Copy, Terminal, Zap, Shield, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MCP = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已复制",
      description: "配置代码已复制到剪贴板",
    });
  };

  const configCode = `{
  "mcpServers": {
    "photoommit": {
      "command": "npx",
      "args": ["@tans-dev/photoommit-mcp@latest"],
      "env": {
        // OSS 区域，如 oss-cn-shanghai
        "OSS_REGION": "your-region",
        // AccessKey ID
        "OSS_ACCESS_KEY_ID": "your-access-key-id",
        // AccessKey Secret
        "OSS_ACCESS_KEY_SECRET": "your-access-key-secret",
        // 存储桶名称
        "OSS_BUCKET": "your-bucket-name",
        // Endpoint，推荐加速域名
        "OSS_ENDPOINT": "your-endpoint"
      }
    }
  }
}`;

  const features = [
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "CLI 集成",
      description: "通过命令行工具快速上传图片到云存储"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "高性能",
      description: "优化的上传算法，支持批量处理"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "安全可靠",
      description: "支持阿里云OSS，企业级安全保障"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "多存储支持",
      description: "灵活配置各种云存储服务"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Code className="w-4 h-4" />
              MCP Protocol Support
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                MCP 协议集成
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              通过 Model Context Protocol (MCP) 协议，让 AI 助手直接使用 iimage 图床服务，
              实现无缝的图片上传和管理体验。
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/30 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Terminal className="w-8 h-8 text-primary" />
                  配置方法
                </CardTitle>
                <CardDescription className="text-base">
                  将以下配置添加到你的 MCP 客户端配置文件中
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => copyToClipboard(configCode)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      复制配置
                    </Button>
                  </div>
                  
                  <pre className="bg-background/80 border border-primary/20 rounded-lg p-6 overflow-x-auto text-sm">
                    <code className="text-foreground">{configCode}</code>
                  </pre>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">配置说明</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <code className="text-primary font-mono text-sm">OSS_REGION</code>
                        <p className="text-muted-foreground text-sm mt-1">阿里云OSS区域，如：oss-cn-shanghai</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <code className="text-primary font-mono text-sm">OSS_ACCESS_KEY_ID</code>
                        <p className="text-muted-foreground text-sm mt-1">阿里云访问密钥ID</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <code className="text-primary font-mono text-sm">OSS_ACCESS_KEY_SECRET</code>
                        <p className="text-muted-foreground text-sm mt-1">阿里云访问密钥Secret</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <code className="text-primary font-mono text-sm">OSS_BUCKET</code>
                        <p className="text-muted-foreground text-sm mt-1">OSS存储桶名称</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <code className="text-primary font-mono text-sm">OSS_ENDPOINT</code>
                        <p className="text-muted-foreground text-sm mt-1">OSS访问端点，推荐使用CDN加速域名</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Steps */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                使用步骤
              </span>
            </h2>
            
            <div className="grid gap-6">
              {[
                {
                  step: "1",
                  title: "安装配置",
                  description: "将配置添加到你的 MCP 客户端（如 Claude Desktop）配置文件中"
                },
                {
                  step: "2", 
                  title: "重启客户端",
                  description: "重启你的 MCP 客户端以加载新的服务器配置"
                },
                {
                  step: "3",
                  title: "开始使用",
                  description: "现在可以直接在对话中让 AI 助手上传和管理图片了"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-card/30 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCP;