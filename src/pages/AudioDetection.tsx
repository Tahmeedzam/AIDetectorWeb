import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Upload } from "lucide-react";
import DetectionResult from "@/components/DetectionResult";
import { useToast } from "@/hooks/use-toast";

const AudioDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
    additionalInfo?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Error",
          description: "Please select a valid audio file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "Error",
          description: "Audio file must be smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setResult(null);
    }
  };

  const analyzeAudio = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an audio file to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate audio processing
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock result - returning dummy detection as specified
      const confidence = Math.random() * 0.4 + 0.3; // Random confidence between 30-70%
      
      setResult({
        isAI: false, // Always return "not AI generated" for dummy implementation
        confidence,
        additionalInfo: `Audio analysis complete (DEMO MODE). File duration: ~${Math.floor(Math.random() * 120 + 30)} seconds. Real AI audio detection coming soon.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Audio AI Detection
              <span className="ml-3 text-sm bg-orange-500/20 text-orange-600 px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </h1>
            <p className="text-muted-foreground">
              Advanced audio AI detection is in development. Premium audio analysis tools are being integrated.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Audio</CardTitle>
              <CardDescription>
                Select an audio file (MP3, WAV, M4A) up to 50MB for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <Headphones className="h-16 w-16 text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Choose Different Audio
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Click to upload audio</p>
                      <p className="text-sm text-muted-foreground">
                        Supports MP3, WAV, M4A up to 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2 text-orange-800 dark:text-orange-200">Coming Soon:</p>
                  <ul className="space-y-1 text-orange-700 dark:text-orange-300">
                    <li>• Professional audio AI detection APIs are being integrated</li>
                    <li>• Advanced voice synthesis detection capabilities</li>
                    <li>• Support for multiple audio formats and quality levels</li>
                    <li>• Real-time streaming audio analysis</li>
                  </ul>
                </div>
              )}

              <Button 
                onClick={analyzeAudio} 
                disabled={true}
                className="w-full opacity-50 cursor-not-allowed"
              >
                Coming Soon - Audio Detection
              </Button>
            </CardContent>
          </Card>

          {(result || loading) && (
            <DetectionResult
              isAI={result?.isAI || false}
              confidence={result?.confidence || 0}
              additionalInfo={result?.additionalInfo}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioDetection;