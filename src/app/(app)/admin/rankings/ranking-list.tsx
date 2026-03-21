
'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award } from 'lucide-react';
import type { CandidateRanking } from './page';
import type { EvaluationSchema } from '@/lib/types';
import { AggregationLogicPanel } from './aggregation-logic-panel';

interface RankingListProps {
  data: CandidateRanking[];
  schemas: EvaluationSchema[];
}

export function RankingList({ data, schemas }: RankingListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRanking | null>(null);

  const allCriteriaNames = useMemo(() => {
    if (schemas.length === 0) return [];
    // Using the first schema for columns, as this is a mock
    return schemas[0].criteria.map(c => c.name);
  }, [schemas]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 text-green-700';
    if (score >= 75) return 'bg-yellow-500/20 text-yellow-700';
    if (score > 0) return 'bg-red-500/20 text-red-700';
    return 'bg-muted';
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Avg. Score</TableHead>
              {allCriteriaNames.map(name => <TableHead key={name}>{name}</TableHead>)}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.candidate.id}>
                  <TableCell className="text-center font-bold text-lg text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                        {index < 3 && <Award className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-yellow-700'}`} />}
                        <span>{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.candidate.profile?.avatarUrl} alt={item.candidate.name} />
                        <AvatarFallback>{item.candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{item.evaluationCount} evaluation(s)</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(item.aggregatedScore)}>{item.aggregatedScore}</Badge>
                  </TableCell>
                  {allCriteriaNames.map(name => (
                    <TableCell key={name}>
                      {item.criteriaScores[name] !== undefined ? (
                        <Badge variant="outline">{item.criteriaScores[name]}/10</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(item)}>
                      View Logic
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allCriteriaNames.length + 4} className="h-24 text-center">
                  No candidates with evaluations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AggregationLogicPanel
        isOpen={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
        rankingData={selectedCandidate}
        schema={schemas[0]} // Pass first schema for simulation
      />
    </>
  );
}
