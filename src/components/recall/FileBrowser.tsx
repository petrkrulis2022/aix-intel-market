
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileJson, Folder } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FileStorageService from "@/services/recall/FileStorageService";

interface FileBrowserProps {
  filetype: "jsonl" | "json";
  onSelectFile: (filename: string) => void;
  className?: string;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ filetype, onSelectFile, className }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const filesList = await FileStorageService.listFiles(filetype);
        setFiles(filesList);
      } catch (error) {
        console.error(`Error loading ${filetype} files:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [filetype]);

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {files.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Folder className="mx-auto h-8 w-8 opacity-50 mb-2" />
            <p>No {filetype.toUpperCase()} files found</p>
          </div>
        ) : (
          <ul className="divide-y">
            {files.map((file, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelectFile(file)}
              >
                <FileJson className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{file}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FileBrowser;
