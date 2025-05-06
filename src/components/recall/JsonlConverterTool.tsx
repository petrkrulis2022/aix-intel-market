
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileJson, Download, Upload } from "lucide-react";
import JsonlConverter from "@/services/recall/JsonlConverter";

const JsonlConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedData, setConvertedData] = useState<any[] | null>(null);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Check if file is a .jsonl file
      if (!selectedFile.name.toLowerCase().endsWith('.jsonl')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a .jsonl file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setConvertedData(null);
      setIsDownloadable(false);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a JSONL file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    try {
      const jsonData = await JsonlConverter.convertFile(file);
      setConvertedData(jsonData);
      setIsDownloadable(true);
      
      toast({
        title: "Conversion Successful",
        description: `Converted ${jsonData.length} entries with resource estimates`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Conversion Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedData) return;
    
    try {
      // Create JSON content
      const jsonContent = JSON.stringify(convertedData, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and click it
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = file ? file.name.replace('.jsonl', '.json') : 'converted.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your converted JSON file download has started",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download converted JSON file",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileJson className="w-5 h-5 mr-2 text-primary" />
          JSONL to JSON Converter
        </CardTitle>
        <CardDescription>
          Convert Chain of Thought JSONL logs to JSON format with resource usage estimates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
          <input
            type="file"
            id="jsonl-file"
            accept=".jsonl"
            className="hidden"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="jsonl-file" 
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-8 h-8 mb-2 text-primary" />
            <span className="text-sm font-medium">
              {file ? file.name : "Select JSONL file"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Click to browse files
            </span>
          </label>
        </div>

        {file && (
          <Button 
            onClick={handleConvert}
            disabled={isConverting}
            className="w-full"
          >
            {isConverting ? "Converting..." : "Convert to JSON with Resource Estimates"}
          </Button>
        )}

        {convertedData && (
          <div className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Preview:</h3>
            <div className="max-h-60 overflow-y-auto rounded-md bg-muted p-4">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(convertedData.slice(0, 2), null, 2)}
                {convertedData.length > 2 && "\n\n... more entries ..."}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      
      {isDownloadable && (
        <CardFooter>
          <Button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center"
            variant="default"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Converted JSON
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default JsonlConverterTool;
