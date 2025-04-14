
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tag, Plus, X } from "lucide-react";

interface MarketplaceSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceData: any;
  aixValuation: any;
  onSubmit: () => void;
}

const MarketplaceSubmissionDialog: React.FC<MarketplaceSubmissionDialogProps> = ({
  open,
  onOpenChange,
  resourceData,
  aixValuation,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tag.trim() !== "" && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your marketplace listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission to marketplace
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
      toast({
        title: "Task Listed on Marketplace",
        description: `Your task "${title}" has been successfully listed with a value of ${aixValuation.aix_value.toFixed(2)} AIX.`,
      });
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List Task on Marketplace</DialogTitle>
          <DialogDescription>
            Create a marketplace listing for the validated task
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Market Analysis Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this task accomplishes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {t}
                    <button onClick={() => handleRemoveTag(t)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AIX Valuation:</span>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  {aixValuation?.aix_value.toFixed(2)} AIX
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {isSubmitting ? "Submitting..." : "List on Marketplace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceSubmissionDialog;
