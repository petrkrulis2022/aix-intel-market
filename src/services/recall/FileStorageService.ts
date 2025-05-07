
/**
 * FileStorageService - Manages storage and retrieval of JSONL and JSON files using Supabase
 */
import { supabase } from "@/integrations/supabase/client";

export class FileStorageService {
  /**
   * Save a file to Supabase
   * @param filename The name of the file
   * @param content The file content
   * @param filetype The type of file (jsonl or json)
   */
  public static async saveFile(filename: string, content: string, filetype: "jsonl" | "json"): Promise<void> {
    try {
      // First check if file already exists
      const { data: existingFile } = await supabase
        .from('files')
        .select('id')
        .eq('filename', filename)
        .eq('filetype', filetype)
        .single();

      let fileId: string;

      if (existingFile) {
        // Update existing file
        fileId = existingFile.id;
        
        // Update file metadata
        await supabase
          .from('files')
          .update({
            updated_at: new Date().toISOString(),
            size: content.length
          })
          .eq('id', fileId);
          
        // Update file content
        await supabase
          .from('file_contents')
          .update({
            content: content
          })
          .eq('file_id', fileId);
      } else {
        // Insert new file metadata
        const { data: newFile, error: fileError } = await supabase
          .from('files')
          .insert({
            filename,
            filetype,
            size: content.length
          })
          .select()
          .single();

        if (fileError || !newFile) {
          throw new Error(`Failed to insert file metadata: ${fileError?.message || "Unknown error"}`);
        }

        fileId = newFile.id;

        // Insert file content
        const { error: contentError } = await supabase
          .from('file_contents')
          .insert({
            file_id: fileId,
            content
          });

        if (contentError) {
          // Clean up if content insertion failed
          await supabase.from('files').delete().eq('id', fileId);
          throw new Error(`Failed to insert file content: ${contentError.message}`);
        }
      }
    } catch (error) {
      console.error("Error saving file to Supabase:", error);
      throw new Error(`Failed to save ${filetype} file: ${error}`);
    }
  }

  /**
   * Get the content of a file
   * @param filename The name of the file
   * @param filetype The type of file (jsonl or json)
   * @returns The file content or null if not found
   */
  public static async getFileContent(filename: string, filetype: "jsonl" | "json"): Promise<string | null> {
    try {
      // First get the file ID
      const { data: file } = await supabase
        .from('files')
        .select('id')
        .eq('filename', filename)
        .eq('filetype', filetype)
        .single();

      if (!file) {
        return null;
      }

      // Get the file content
      const { data: content } = await supabase
        .from('file_contents')
        .select('content')
        .eq('file_id', file.id)
        .single();

      return content ? content.content : null;
    } catch (error) {
      console.error("Error getting file from Supabase:", error);
      return null;
    }
  }

  /**
   * List all files of a specific type
   * @param filetype The type of file (jsonl or json)
   * @returns Array of filenames
   */
  public static async listFiles(filetype: "jsonl" | "json"): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('filename')
        .eq('filetype', filetype)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data ? data.map(file => file.filename) : [];
    } catch (error) {
      console.error(`Error listing ${filetype} files:`, error);
      return [];
    }
  }

  /**
   * Delete a file
   * @param filename The name of the file
   * @param filetype The type of file (jsonl or json)
   */
  public static async deleteFile(filename: string, filetype: "jsonl" | "json"): Promise<void> {
    try {
      // Deleting the file will cascade to delete the content due to the foreign key constraint
      await supabase
        .from('files')
        .delete()
        .eq('filename', filename)
        .eq('filetype', filetype);
    } catch (error) {
      console.error(`Error deleting ${filetype} file:`, error);
      throw error;
    }
  }
}

export default FileStorageService;
