
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { CandidateRanking } from './page';
import type { EvaluationCriterion, EvaluationSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';

interface AggregationLogicPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rankingData: CandidateRanking | null;
  schema: EvaluationSchema;
}

export function AggregationLogicPanel({ isOpen, onOpenChange, rankingData, schema }: AggregationLogicPanelProps) {
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [recalculatedScore, setRecalculatedScore] = useState<number | null>(null);

  useEffect(() => {
    if (rankingData && schema) {
      const initialWeights = schema.criteria.reduce((acc, crit) => {
        acc[crit.name] = crit.weight || 1;
        return acc;
      }, {} as Record<string, number>);
      setWeights(initialWeights);
      setRecalculatedScore(null); // Reset on new data
    }
  }, [rankingData, schema]);
  
  const handleWeightChange = (criterionName: string, newWeight: number) => {
    setWeights(prev => ({ ...prev, [criterionName]: newWeight }));
  };
  
  const handleRecalculate = () => {
    if (!rankingData) return;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    for (const criterionName in rankingData.criteriaScores) {
        const score = rankingData.criteriaScores[criterionName];
        const weight = weights[criterionName] || 1;
        
        // Find maxPoints from schema for normalization
        const criterion = schema.criteria.find(c => c.name === criterionName);
        if (criterion) {
            totalWeightedScore += (score / criterion.maxPoints) * weight;
            totalWeight += weight;
        }
    }
    
    const finalScore = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
    setRecalculatedScore(finalScore);
  };
  
  const handleReset = () => {
      if (schema) {
         const initialWeights = schema.criteria.reduce((acc, crit) => {
            acc[crit.name] = crit.weight || 1;
            return acc;
        }, {} as Record<string, number>);
        setWeights(initialWeights);
        setRecalculatedScore(null);
      }
  }

  if (!rankingData) return null;
  
  const totalWeightValue = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Score Aggregation Logic: {rankingData.candidate.name}</DialogTitle>
          <DialogDescription>
            Adjust weights to simulate their impact on the aggregated score.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-md border p-4 space-y-4">
            <h4 className="font-medium">Criteria & Weights</h4>
            <p className="text-xs text-muted-foreground">Adjust the slider to change the weight of each criterion in the calculation.</p>
            {schema.criteria.map(criterion => (
              <div key={criterion.id} className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor={`weight-${criterion.id}`} className="col-span-1 text-sm">{criterion.name}</Label>
                <Slider
                  id={`weight-${criterion.id}`}
                  min={0}
                  max={2}
                  step={0.1}
                  value={[weights[criterion.name] || 1]}
                  onValueChange={(val) => handleWeightChange(criterion.name, val[0])}
                  className="col-span-3"
                />
                <Input
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={weights[criterion.name]?.toFixed(1) || '1.0'}
                    onChange={(e) => handleWeightChange(criterion.name, parseFloat(e.target.value))}
                    className="col-span-1 h-8"
                />
              </div>
            ))}
             <Separator />
             <div className="flex justify-end font-medium">
                Total Weight: 
                <span className={cn(totalWeightValue.toFixed(1) === '1.0' ? 'text-primary' : 'text-destructive', 'ml-2')}>
                    {Object.values(weights).reduce((s, w) => s + w, 0).toFixed(1)}
                </span>
             </div>
          </div>
          
          <div className="flex items-center justify-between gap-4">
             <div className="flex gap-2">
                <Button onClick={handleRecalculate}>
                    <Calculator className="mr-2 h-4 w-4" /> Recalculate Score
                </Button>
                <Button variant="ghost" onClick={handleReset}>Reset</Button>
            </div>

            <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-sm text-muted-foreground">Original Score</p>
                    <p className="text-2xl font-bold">{rankingData.aggregatedScore}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-muted-foreground">Recalculated Score</p>
                    <p className={cn("text-2xl font-bold", recalculatedScore !== null ? 'text-primary' : '')}>
                        {recalculatedScore ?? '-'}
                    </p>
                 </div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-md">
                <code className="text-sm text-muted-foreground">
                    Aggregated Score = Σ (Criterion Score / Max Points) × Weightage
                </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
