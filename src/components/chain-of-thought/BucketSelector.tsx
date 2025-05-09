
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface BucketSelectorProps {
  buckets: string[];
  selectedBucket: string;
  setSelectedBucket: (bucket: string) => void;
  fetchBuckets: () => Promise<void>;
  isLoading: boolean;
}

const BucketSelector: React.FC<BucketSelectorProps> = ({
  buckets,
  selectedBucket,
  setSelectedBucket,
  fetchBuckets,
  isLoading,
}) => {
  // Ensure we have valid buckets to display
  const validBuckets = buckets.filter(bucket => bucket && bucket.trim() !== '');
  
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">Select Bucket</label>
        <Select 
          value={selectedBucket || undefined} 
          onValueChange={setSelectedBucket}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a bucket" />
          </SelectTrigger>
          <SelectContent>
            {validBuckets.length > 0 ? (
              validBuckets.map((bucket) => (
                <SelectItem key={bucket} value={bucket}>
                  {bucket}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-buckets" disabled>
                No buckets available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={fetchBuckets} disabled={isLoading}>
        <Database className="w-4 h-4 mr-2" />
        Refresh Buckets
      </Button>
    </div>
  );
};

export default BucketSelector;
