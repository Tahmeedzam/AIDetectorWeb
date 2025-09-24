import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload } from "lucide-react";
import DetectionResult from "@/components/DetectionResult";
import ApiWarning from "@/components/ApiWarning";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ImageDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
  if (!selectedFile) {
    toast({
      title: "Error",
      description: "Please select an image to analyze",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  try {
    // Convert image to base64 for storage
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(selectedFile);
    });
    
    const base64Image = await base64Promise;
    
    // Call Sightengine API for real AI detection
    const formData = new FormData();
    formData.append('media', selectedFile);
    formData.append('models', 'genai'); // AI-generated content detection model
    // formData.append('api_user', process.env.REACT_APP_SIGHTENG_USER || '334590953');
    // formData.append('api_secret', process.env.REACT_APP_SIGHTENG_SECRET || '5GyUFfJAudt94pBYuxJYZYs6jJnAtjcu');
    formData.append('api_user', '334590953');
    formData.append('api_secret','5GyUFfJAudt94pBYuxJYZYs6jJnAtjcu');

    const sightengineResponse = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: formData
    });

    if (!sightengineResponse.ok) {
      throw new Error(`Sightengine API error: ${sightengineResponse.status}`);
    }

    const sightengineData = await sightengineResponse.json();
    
    // Process Sightengine response
    const aiGenerated = sightengineData.type?.ai_generated || 0;
    const confidence = aiGenerated;
    const isAI = confidence > 0.5;
    const verdict = isAI ? "AI Generated" : "Real Image";
    
    // Save to Supabase with real results
    await supabase.from('detection_results').insert({
      content_type: 'image',
      file_name: selectedFile.name,
      file_size: selectedFile.size,
      content_url: base64Image,
      ai_score: confidence,
      ai_verdict: verdict,
      analysis_details: { 
        sightengine_response: sightengineData,
        file_type: selectedFile.type,
        analysis_method: 'Sightengine AI Detection API'
      }
    });
    
    setResult({
      isAI,
      confidence,
      additionalInfo: `Real AI detection complete. File size: ${(selectedFile.size / 1024).toFixed(2)} KB. Confidence: ${(confidence * 100).toFixed(1)}%`,
    });
    
    toast({
      title: "Success",
      description: "Image analyzed successfully with real AI detection!",
    });
    
  } catch (error) {
    console.error("Analysis Error:", error);
    
    // Fallback to mock if API fails
    console.log("Falling back to mock detection due to API error");
    const confidence = Math.random();
    const isAI = confidence > 0.5;
    const verdict = isAI ? "AI Generated (Mock)" : "Real Image (Mock)";
    
    setResult({
      isAI,
      confidence,
      additionalInfo: `API unavailable - using mock detection. File size: ${(selectedFile.size / 1024).toFixed(2)} KB. Mock Confidence: ${(confidence * 100).toFixed(1)}%`,
    });
    
    toast({
      title: "Warning", 
      description: "API error - showing mock results. Check console for details.",
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
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Image AI Detection
            </h1>
            <p className="text-muted-foreground">
              Upload an image to detect AI-generated or manipulated content
            </p>
          </div>

          <ApiWarning />

          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image file (JPG, PNG, WEBP) to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Click to upload image</p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={analyzeImage} 
                disabled={loading || !selectedFile}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Image"}
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

export default ImageDetection;