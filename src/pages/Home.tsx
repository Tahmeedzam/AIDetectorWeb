import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Headphones, Bot, Shield, History } from "lucide-react";
import PreviousChecks from "@/components/PreviousChecks";

const Home = () => {
  const detectionTypes = [
    {
      path: "/text",
      title: "Text Detection",
      description: "Analyze text content to detect AI-generated writing",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      path: "/image",
      title: "Image Detection",
      description: "Identify AI-generated or manipulated images",
      icon: Image,
      color: "text-purple-500",
    },
    {
      path: "/video",
      title: "Video Detection",
      description: "Analyze video content frame-by-frame for AI generation",
      icon: Video,
      color: "text-red-500",
    },
    {
      path: "/audio",
      title: "Audio Detection",
      description: "Advanced audio AI detection coming soon",
      icon: Headphones,
      color: "text-orange-500",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Bot className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Content Detector
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Advanced detection system to identify AI-generated content across multiple media types. 
            Protect yourself from deepfakes and synthetic content.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure • Fast • Accurate</span>
          </div>
        </div>

        {/* Detection Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {detectionTypes.map(({ path, title, description, icon: Icon, color, status }) => (
            <Card key={path} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-secondary">
                    <Icon className={`h-8 w-8 ${color}`} />
                  </div>
                </div>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  {title}
                  {status && (
                    <span className="text-xs bg-orange-500/20 text-orange-600 px-2 py-1 rounded-full">
                      {status}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" disabled={!!status}>
                  <Link to={path}>
                    {status ? 'Coming Soon' : 'Start Detection'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold">Upload Content</h3>
              <p className="text-muted-foreground text-sm">
                Choose your content type and upload files or paste text
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our algorithms analyze patterns and detect AI signatures
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                Receive detailed analysis with confidence scores
              </p>
            </div>
          </div>
        </div>

        {/* Previous Checks Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <History className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Previous Checks
            </h2>
            <p className="text-muted-foreground">
              View your recent AI detection analysis history
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <PreviousChecks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;