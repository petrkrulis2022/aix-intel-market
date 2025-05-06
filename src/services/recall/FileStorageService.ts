
/**
 * FileStorageService - Manages storage and retrieval of JSONL and JSON files
 */
export class FileStorageService {
  private static JSONL_FILES_KEY = "jsonl_files";
  private static JSON_FILES_KEY = "json_files";
  private static FILE_CONTENTS_PREFIX = "file_content_";

  /**
   * Save a file to local storage
   * @param filename The name of the file
   * @param content The file content
   * @param filetype The type of file (jsonl or json)
   */
  public static async saveFile(filename: string, content: string, filetype: "jsonl" | "json"): Promise<void> {
    try {
      // Store the content
      localStorage.setItem(this.FILE_CONTENTS_PREFIX + filename, content);
      
      // Update the file list
      const fileListKey = filetype === "jsonl" ? this.JSONL_FILES_KEY : this.JSON_FILES_KEY;
      const existingFiles = this.getFileList(filetype);
      
      if (!existingFiles.includes(filename)) {
        existingFiles.push(filename);
        localStorage.setItem(fileListKey, JSON.stringify(existingFiles));
      }
    } catch (error) {
      console.error("Error saving file:", error);
      throw new Error(`Failed to save ${filetype} file: ${error}`);
    }
  }

  /**
   * Get the content of a file
   * @param filename The name of the file
   * @returns The file content or null if not found
   */
  public static getFileContent(filename: string): string | null {
    return localStorage.getItem(this.FILE_CONTENTS_PREFIX + filename);
  }

  /**
   * List all files of a specific type
   * @param filetype The type of file (jsonl or json)
   * @returns Array of filenames
   */
  public static listFiles(filetype: "jsonl" | "json"): string[] {
    return this.getFileList(filetype);
  }

  /**
   * Delete a file
   * @param filename The name of the file
   * @param filetype The type of file (jsonl or json)
   */
  public static deleteFile(filename: string, filetype: "jsonl" | "json"): void {
    // Remove content
    localStorage.removeItem(this.FILE_CONTENTS_PREFIX + filename);
    
    // Update file list
    const fileListKey = filetype === "jsonl" ? this.JSONL_FILES_KEY : this.JSON_FILES_KEY;
    let existingFiles = this.getFileList(filetype);
    existingFiles = existingFiles.filter(file => file !== filename);
    localStorage.setItem(fileListKey, JSON.stringify(existingFiles));
  }

  /**
   * Get list of files from storage
   */
  private static getFileList(filetype: "jsonl" | "json"): string[] {
    const fileListKey = filetype === "jsonl" ? this.JSONL_FILES_KEY : this.JSON_FILES_KEY;
    const fileList = localStorage.getItem(fileListKey);
    return fileList ? JSON.parse(fileList) : [];
  }
}

export default FileStorageService;
