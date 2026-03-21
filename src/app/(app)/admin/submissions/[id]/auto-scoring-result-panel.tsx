
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, RefreshCw, BrainCircuit, FileCheck2, FlaskConical } from 'lucide-react';
import type { Submission } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

const getStatusVariant = (status?: Submission['autoScoringStatus']) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Failed': return 'destructive';
        case 'Pending': return 'outline';
        default: return 'outline';
    }
};

const mockScoreBreakdown = (submission: Submission) => {
    if (submission.autoScoringStatus !== 'Completed') return [];
    
    let baseScore = 60;
    const breakdown = [
        { name: 'Base Score', value: baseScore, icon: BrainCircuit },
    ];

    if (submission.validationStatus === 'Valid') {
        baseScore += 15;
        breakdown.push({ name: 'Validation Bonus', value: 15, icon: FileCheck2 });
    } else if (submission.validationStatus === 'Warning') {
        baseScore += 5;
        breakdown.push({ name: 'Validation Points', value: 5, icon: FileCheck2 });
    } else if (submission.validationStatus === 'Invalid') {
        baseScore -= 10;
        breakdown.push({ name: 'Validation Penalty', value: -10, icon: FileCheck2 });
    }

    if (submission.testCaseStatus === 'Passed') {
        baseScore += 25;
        breakdown.push({ name: 'Test Case Bonus', value: 25, icon: FlaskConical });
    } else if (submission.testCaseStatus === 'Warning') {
        baseScore += 10;
        breakdown.push({ name: 'Test Case Points', value: 10, icon: FlaskConical });
    } else if (submission.testCaseStatus === 'Failed') {
        baseScore -= 20;
        breakdown.push({ name: 'Test Case Penalty', value: -20, icon: FlaskConical });
    }
    
    // ensure score matches mock data
    const adjustment = (submission.autoScore || 0) - baseScore;
    if (adjustment !== 0) {
        breakdown.push({ name: 'AI Quality Adjustment', value: adjustment, icon: BrainCircuit });
    }

    return breakdown;
};

export function AutoScoringResultPanel({ submission }: { submission: Submission }) {
    const breakdown = mockScoreBreakdown(submission);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Auto-Scoring Results
                </CardTitle>
                <CardDescription>
                    Automated scoring based on configured rules and checks.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                        <h4 className="font-semibold">Overall Auto-Score</h4>
                        <p className="text-sm text-muted-foreground">Calculated from various metrics.</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">{submission.autoScore || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scoring Status</span>
                    <Badge variant={getStatusVariant(submission.autoScoringStatus)}>
                        {submission.autoScoringStatus || 'Pending'}
                    </Badge>
                </div>

                {breakdown.length > 0 && (
                     <div className="space-y-3 pt-2">
                        <h4 className="font-semibold">Score Breakdown</h4>
                        {breakdown.map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className={item.value > 0 ? "text-green-600" : "text-destructive"}>
                                        {item.value > 0 ? `+${item.value}` : item.value}
                                    </span>
                                </div>
                            )
                        })}
                        <div className="flex items-center justify-between font-bold text-base pt-2 border-t">
                            <span>Final Score</span>
                            <span>{submission.autoScore}</span>
                        </div>
                    </div>
                )}
               
                <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recalculate Score
                </Button>
            </CardContent>
        </Card>
    );
}
