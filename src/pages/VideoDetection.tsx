import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import DetectionResult from "@/components/DetectionResult";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VideoDetection = () => {
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
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Error",
          description: "Please select a valid video file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "Error",
          description: "Video file must be smaller than 100MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setResult(null);
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a video to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For video, we'd need to extract frames client-side or use a backend
      // Since this is a frontend prototype, we'll simulate the process
      
      // Simulate frame extraction and API calls
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you'd:
      // 1. Extract frames using canvas/video element
      // 2. Send each frame to Sightengine API
      // 3. Aggregate results
      
      const estimatedDuration = 30; // Mock duration
      const framesProcessed = Math.ceil(estimatedDuration / 5);
      
      // Simulate multiple API calls to Sightengine for frames
      const confidence = Math.random();
      const isAI = confidence > 0.5;
      const verdict = isAI ? "AI Generated" : "Real Video";
      
      // Save to Supabase
      await supabase.from('detection_results').insert({
        content_type: 'video',
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        ai_score: confidence,
        ai_verdict: verdict,
        analysis_details: { frames_processed: framesProcessed, estimated_duration: estimatedDuration, file_type: selectedFile.type }
      });
      
      setResult({
        isAI,
        confidence,
        additionalInfo: `Video analysis simulated. Would process ${framesProcessed} frames via Sightengine API (1 frame every 5 seconds). File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB. Note: Frame extraction requires backend implementation.`,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze video. Frame extraction requires backend processing.",
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
                <Video className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Video AI Detection
            </h1>
            <p className="text-muted-foreground">
              Upload a video to detect AI-generated content through frame analysis
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Select a video file (MP4, MOV, AVI) up to 100MB for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <Video className="h-16 w-16 text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Choose Different Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Click to upload video</p>
                      <p className="text-sm text-muted-foreground">
                        Supports MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Analysis Process:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Extract 1 frame every 5 seconds</li>
                    <li>• Analyze each frame for AI patterns</li>
                    <li>• Calculate overall confidence score</li>
                    <li>• Processing time: ~30 seconds</li>
                  </ul>
                </div>
              )}

              <Button 
                onClick={analyzeVideo} 
                disabled={loading || !selectedFile}
                className="w-full"
              >
                {loading ? "Analyzing Video..." : "Analyze Video"}
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

export default VideoDetection;