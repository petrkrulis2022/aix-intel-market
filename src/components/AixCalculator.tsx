
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Clock, BarChart, Zap } from "lucide-react";

const AixCalculator = () => {
  // Initial weights and resource values
  const [weights, setWeights] = useState({
    w1: 0.4, // Hardware weight
    w2: 0.3, // Time weight
    w3: 0.2, // Performance weight
    w4: 0.1, // Energy efficiency weight
  });

  const [resources, setResources] = useState({
    hardware: 50, // Hardware score (0-100)
    time: 60, // Time metric (0-100)
    performance: 75, // Performance score (0-100)
    energy: 45, // Energy efficiency (0-100)
  });

  const [aixValue, setAixValue] = useState(0);

  // Calculate AIX value when inputs change
  useEffect(() => {
    const calculatedValue = 
      (weights.w1 * resources.hardware) + 
      (weights.w2 * resources.time) + 
      (weights.w3 * resources.performance) + 
      (weights.w4 * resources.energy);
    
    // Scale to a reasonable AIX value (assuming 100 points = 10 AIX)
    setAixValue(Number((calculatedValue / 10).toFixed(2)));
  }, [weights, resources]);

  // Handle weight changes
  const handleWeightChange = (key, value) => {
    // Ensure weights sum to 1
    const newWeights = { ...weights, [key]: value };
    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0);
    
    if (sum !== 1) {
      // Normalize other weights
      const factor = (1 - value) / (sum - newWeights[key]);
      Object.keys(newWeights).forEach(k => {
        if (k !== key) {
          newWeights[k] = Number((newWeights[k] * factor).toFixed(2));
        }
      });
    }
    
    setWeights(newWeights);
  };

  // Handle resource value changes
  const handleResourceChange = (key, value) => {
    setResources(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle>AIX Value Calculator</CardTitle>
        <CardDescription>
          Calculate AIX token value based on resource metrics using the AIX standard formula
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hardware Resource Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-primary" />
                  Hardware Resource Score (H)
                </Label>
                <span className="text-sm font-medium">{resources.hardware}</span>
              </div>
              <Slider 
                value={[resources.hardware]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => handleResourceChange('hardware', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low CPU/GPU</span>
                <span>High CPU/GPU</span>
              </div>
            </div>

            {/* Time Metric Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-secondary" />
                  Time Metric Score (T)
                </Label>
                <span className="text-sm font-medium">{resources.time}</span>
              </div>
              <Slider 
                value={[resources.time]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => handleResourceChange('time', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Brief Processing</span>
                <span>Extended Processing</span>
              </div>
            </div>

            {/* Performance Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-green-500" />
                  Performance Score (P)
                </Label>
                <span className="text-sm font-medium">{resources.performance}</span>
              </div>
              <Slider 
                value={[resources.performance]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => handleResourceChange('performance', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Base Performance</span>
                <span>Advanced Performance</span>
              </div>
            </div>

            {/* Energy Efficiency Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Energy Efficiency Score (E)
                </Label>
                <span className="text-sm font-medium">{resources.energy}</span>
              </div>
              <Slider 
                value={[resources.energy]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => handleResourceChange('energy', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Energy Intensive</span>
                <span>Energy Efficient</span>
              </div>
            </div>
          </div>

          {/* Component Weights */}
          <div className="pt-2 border-t border-border/50">
            <h3 className="text-sm font-medium mb-3">Component Weights (must sum to 1.0)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="w1" className="text-xs">Hardware (w₁)</Label>
                <Input
                  id="w1"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.w1}
                  onChange={(e) => handleWeightChange('w1', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="w2" className="text-xs">Time (w₂)</Label>
                <Input
                  id="w2"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.w2}
                  onChange={(e) => handleWeightChange('w2', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="w3" className="text-xs">Performance (w₃)</Label>
                <Input
                  id="w3"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.w3}
                  onChange={(e) => handleWeightChange('w3', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="w4" className="text-xs">Energy (w₄)</Label>
                <Input
                  id="w4"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.w4}
                  onChange={(e) => handleWeightChange('w4', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* AIX Formula and Result */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-muted/50 p-3 rounded-md w-full overflow-x-auto my-3">
                <code className="text-xs md:text-sm whitespace-nowrap">
                  AIX Value = (w₁ × H) + (w₂ × T) + (w₃ × P) + (w₄ × E) = 
                  ({weights.w1} × {resources.hardware}) + 
                  ({weights.w2} × {resources.time}) + 
                  ({weights.w3} × {resources.performance}) + 
                  ({weights.w4} × {resources.energy})
                </code>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">Calculated AIX Value</div>
                <div className="text-3xl font-bold text-primary">{aixValue} AIX</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AixCalculator;
