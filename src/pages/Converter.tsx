
import React, { useState } from "react";
import JsonlConverterTool from "@/components/recall/JsonlConverterTool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileBrowser from "@/components/recall/FileBrowser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileJson, Loader2 } from "lucide-react";
import FileStorageService from "@/services/recall/FileStorageService";
import { toast } from "@/components/ui/use-toast";

const Converter = () => {
  const [selectedJsonFile, setSelectedJsonFile] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState<string>("");

  const handleSelectJsonFile = async (filename: string) => {
    setSelectedJsonFile(filename);
    setIsLoading(true);
    
    try {
      const content = await FileStorageService.getFileContent(filename, "json");
      
      if (content) {
        try {
          const parsedContent = JSON.parse(content);
          setJsonContent(parsedContent);
          
          // Extract task name if available in the first entry
          if (parsedContent.length > 0 && parsedContent[0].taskName) {
            setTaskName(parsedContent[0].taskName);
          } else {
            // Try to extract task name from filename (if in format taskname_filename.json)
            const filenameMatch = filename.match(/^([^_]+)_/);
            if (filenameMatch && filenameMatch[1]) {
              setTaskName(filenameMatch[1].replace(/_/g, ' '));
            } else {
              setTaskName("");
            }
          }
          
          toast({
            title: "File Loaded",
            description: `Loaded ${filename} successfully`,
          });
        } catch (error) {
          toast({
            title: "Parse Error",
            description: "Failed to parse JSON content",
            variant: "destructive",
          });
          setJsonContent(null);
          setTaskName("");
        }
      } else {
        toast({
          title: "Load Error",
          description: "File content not found",
          variant: "destructive",
        });
        setJsonContent(null);
        setTaskName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while loading the file",
        variant: "destructive",
      });
      setJsonContent(null);
      setTaskName("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!selectedJsonFile || !jsonContent) return;
    
    try {
      // Create JSON content
      const jsonContentStr = JSON.stringify(jsonContent, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonContentStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and click it
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = selectedJsonFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your JSON file download has started",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download JSON file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chain of Thought Converter</h1>
          <p className="text-muted-foreground">
            Convert Recall Network JSONL logs to JSON format with resource usage estimates
          </p>
        </div>
        
        <Tabs defaultValue="convert" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="convert">Convert JSONL Files</TabsTrigger>
            <TabsTrigger value="view">View JSON Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="convert" className="pt-4">
            <JsonlConverterTool />
          </TabsContent>
          
          <TabsContent value="view" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Available JSON Files</h3>
                <FileBrowser 
                  filetype="json"
                  onSelectFile={handleSelectJsonFile}
                  className="min-h-[300px]"
                />
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md flex items-center">
                      <FileJson className="w-4 h-4 mr-2 text-primary" />
                      {selectedJsonFile || "Select a JSON file"}
                    </CardTitle>
                    {taskName && (
                      <div className="text-sm text-muted-foreground">
                        Task: <span className="font-medium">{taskName}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : jsonContent ? (
                      <>
                        <div className="max-h-80 overflow-y-auto rounded-md bg-muted p-4 mb-4">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(jsonContent, null, 2)}
                          </pre>
                        </div>
                        <Button 
                          onClick={handleDownloadJson}
                          className="w-full flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download JSON File
                        </Button>
                      </>
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        Select a JSON file to view its contents
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <h2 className="text-lg font-medium mb-2">About this tool</h2>
          <p className="text-sm text-muted-foreground mb-2">
            This tool allows you to convert Chain of Thought logs from Recall Network's JSONL format to 
            JSON format with added resource usage estimates. The estimates are calculated based on:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Token count (words in the log)</li>
            <li>Complexity indicators (LLM operations, mathematical calculations)</li>
            <li>Estimated execution time</li>
          </ul>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> These estimates are approximate and meant to demonstrate the AIX valuation concept. 
              In a production environment, more sophisticated metrics would be used for precise resource measurement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
