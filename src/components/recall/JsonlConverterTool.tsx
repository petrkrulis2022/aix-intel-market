
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { FileJson, Download, Upload, Folder, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JsonlConverter from "@/services/recall/JsonlConverter";
import FileStorageService from "@/services/recall/FileStorageService";
import FileBrowser from "./FileBrowser";

const JsonlConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [convertedData, setConvertedData] = useState<any[] | null>(null);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [selectedJsonlFile, setSelectedJsonlFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [taskName, setTaskName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsUploading(true);

      // Save the file to storage
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            await FileStorageService.saveFile(
              selectedFile.name,
              event.target.result as string,
              "jsonl"
            );
            
            toast({
              title: "File Saved",
              description: `${selectedFile.name} has been saved to database`,
            });
          } catch (error) {
            toast({
              title: "Save Failed",
              description: `Failed to save ${selectedFile.name}`,
              variant: "destructive",
            });
          } finally {
            setIsUploading(false);
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSelectJsonlFile = (filename: string) => {
    setSelectedJsonlFile(filename);
    setFile(null); // Clear the uploaded file
    setConvertedData(null);
    setIsDownloadable(false);
    
    toast({
      title: "File Selected",
      description: `Selected ${filename} for conversion`,
    });
  };

  const handleConvert = async () => {
    if (!file && !selectedJsonlFile) {
      toast({
        title: "No File Selected",
        description: "Please select a JSONL file to convert",
        variant: "destructive",
      });
      return;
    }

    if (!taskName.trim()) {
      toast({
        title: "Task Name Required",
        description: "Please enter a task name for this conversion",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    try {
      let jsonData;
      let jsonFilename: string;
      
      if (file) {
        // Convert uploaded file with task name
        jsonData = await JsonlConverter.convertFile(file, taskName);
        
        // Create filename with task name
        const taskNameForFilename = taskName.replace(/[^a-zA-Z0-9]/g, '_');
        jsonFilename = `${taskNameForFilename}_${file.name.replace('.jsonl', '.json')}`;
        
        // Save the JSON result
        await FileStorageService.saveFile(
          jsonFilename,
          JSON.stringify(jsonData, null, 2),
          "json"
        );
      } else if (selectedJsonlFile) {
        // Convert stored file with task name
        jsonData = await JsonlConverter.convertFileByName(selectedJsonlFile, taskName);
        
        // Filename is handled inside convertFileByName method
        const taskNameForFilename = taskName.replace(/[^a-zA-Z0-9]/g, '_');
        jsonFilename = `${taskNameForFilename}_${selectedJsonlFile.replace('.jsonl', '.json')}`;
      }
      
      setConvertedData(jsonData);
      setIsDownloadable(true);
      
      toast({
        title: "Conversion Successful",
        description: `Task "${taskName}" converted with ${jsonData.length} entries`,
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

  const handleDownload = async () => {
    if (!convertedData) return;
    
    try {
      let jsonFilename;
      
      if (taskName) {
        // Use task name in filename
        const taskNameForFilename = taskName.replace(/[^a-zA-Z0-9]/g, '_');
        jsonFilename = file ? 
          `${taskNameForFilename}_${file.name.replace('.jsonl', '.json')}` : 
          `${taskNameForFilename}_${selectedJsonlFile?.replace('.jsonl', '.json') || 'converted.json'}`;
      } else {
        jsonFilename = file ? 
          file.name.replace('.jsonl', '.json') : 
          selectedJsonlFile?.replace('.jsonl', '.json') || 'converted.json';
      }
      
      // Get JSON content
      const jsonContent = JSON.stringify(convertedData, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and click it
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = jsonFilename;
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="browse">Browse Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="pt-4">
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
              <input
                type="file"
                id="jsonl-file"
                accept=".jsonl"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label 
                htmlFor="jsonl-file" 
                className={`flex flex-col items-center justify-center ${isUploading ? 'opacity-70' : 'cursor-pointer'}`}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mb-2 text-primary" />
                )}
                <span className="text-sm font-medium">
                  {file ? file.name : isUploading ? "Uploading..." : "Select JSONL file"}
                </span>
                {!isUploading && (
                  <span className="text-xs text-muted-foreground mt-1">
                    Click to browse files
                  </span>
                )}
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="browse" className="pt-4">
            <FileBrowser 
              filetype="jsonl"
              onSelectFile={handleSelectJsonlFile}
              className="min-h-[180px]"
            />
          </TabsContent>
        </Tabs>

        {/* Add Task Name Input */}
        <div className="space-y-2">
          <Label htmlFor="task-name">Task Name</Label>
          <Input
            id="task-name"
            placeholder="Enter a name for this task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            The task name will be used to identify this conversion in the AIX dashboard
          </p>
        </div>

        {(file || selectedJsonlFile) && (
          <div className="pt-2">
            <Button 
              onClick={handleConvert}
              disabled={isConverting || isUploading || !taskName.trim()}
              className="w-full"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to JSON with Resource Estimates"
              )}
            </Button>
          </div>
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
