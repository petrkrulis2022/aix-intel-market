
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComputeProvider } from "@/services/providers/ComputeProvidersService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, FileText, DollarSign, Link } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProviderSelectorProps {
  providers: ComputeProvider[];
  selectedProvider: string | null;
  onSelectProvider: (providerId: string) => void;
  loading?: boolean;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">Select Compute Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Compute Provider</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <Card 
            key={provider.id}
            className={`border-border/50 transition-all ${
              selectedProvider === provider.id ? "border-primary border-2" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  {provider.name}
                  {provider.realTime && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
                      Live Pricing
                    </Badge>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center text-xs">
                  <Cpu className="h-3 w-3 mr-1 text-primary" />
                  <span className="text-muted-foreground mr-1">CPU:</span>
                  <span>${provider.pricing.cpuHourlyRate.toFixed(3)}/hr</span>
                </div>
                <div className="flex items-center text-xs">
                  <FileText className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-muted-foreground mr-1">GPU:</span>
                  <span>${provider.pricing.gpuHourlyRate.toFixed(2)}/hr</span>
                </div>
              </div>
              
              <div className="flex mt-2">
                <Button
                  variant={selectedProvider === provider.id ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelectProvider(provider.id)}
                >
                  {selectedProvider === provider.id ? "Selected" : "Select"}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => window.open(provider.website, "_blank")}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderSelector;
