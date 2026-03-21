
import {
  getUsers,
  getSubmissions,
  getEvaluations,
  getEvaluationSchemas,
} from '@/lib/api';
import { RankingList } from './ranking-list';
import type { User, Evaluation, Submission, EvaluationSchema } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type CandidateRanking = {
  candidate: User;
  aggregatedScore: number;
  evaluationCount: number;
  criteriaScores: Record<string, number>;
  percentileRank: number;
};

// This is a mock aggregation logic for the front-end simulation
const calculateAggregatedScore = (
  evaluations: Evaluation[],
  schemas: EvaluationSchema[]
): { score: number; criteria: Record<string, number> } => {
  if (evaluations.length === 0) return { score: 0, criteria: {} };

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const allCriteriaScores: Record<string, { total: number; count: number }> = {};

  evaluations.forEach((ev) => {
    // For simplicity, we'll just use the first schema. A real app would link schemas to tasks.
    const schema = schemas[0];
    let evaluationWeightedScore = 0;
    let evaluationTotalWeight = 0;

    if (ev.criteriaScores && schema) {
      for (const criterion of schema.criteria) {
        const score = ev.criteriaScores[criterion.name];
        const weight = criterion.weight || 1;
        if (score !== undefined) {
          evaluationWeightedScore += (score / criterion.maxPoints) * weight;
          evaluationTotalWeight += weight;

          if (!allCriteriaScores[criterion.name]) {
            allCriteriaScores[criterion.name] = { total: 0, count: 0 };
          }
          allCriteriaScores[criterion.name].total += score;
          allCriteriaScores[criterion.name].count += 1;
        }
      }
    }
    
    // Fallback to simple score if no criteria match
    if (evaluationTotalWeight === 0) {
        totalWeightedScore += ev.score;
        totalWeight += 100;
    } else {
        totalWeightedScore += (evaluationWeightedScore / evaluationTotalWeight) * 100;
        totalWeight += 100;
    }
  });

  const finalScore = Math.round(totalWeightedScore / evaluations.length);
  const finalCriteriaScores: Record<string, number> = {};
  for(const key in allCriteriaScores) {
      finalCriteriaScores[key] = Math.round(allCriteriaScores[key].total / allCriteriaScores[key].count);
  }

  return { score: finalScore, criteria: finalCriteriaScores };
};

export default async function AdminRankingsPage() {
  const [
    allUsers,
    allSubmissions,
    allEvaluations,
    allSchemas,
  ] = await Promise.all([
    getUsers(),
    getSubmissions(),
    getEvaluations(),
    getEvaluationSchemas(),
  ]);

  const candidates = allUsers.filter((u) => u.role === 'candidate');

  const unsortedRankingData: Omit<CandidateRanking, 'percentileRank'>[] = candidates
    .map((candidate) => {
      const candidateSubmissions = allSubmissions.filter(
        (sub) => sub.userId === candidate.id
      );
      const candidateSubmissionIds = new Set(candidateSubmissions.map((s) => s.id));
      const candidateEvaluations = allEvaluations.filter((ev) =>
        candidateSubmissionIds.has(ev.submissionId)
      );

      if (candidateEvaluations.length === 0) {
        return null;
      }
      
      const { score, criteria } = calculateAggregatedScore(candidateEvaluations, allSchemas);

      return {
        candidate,
        aggregatedScore: score,
        evaluationCount: candidateEvaluations.length,
        criteriaScores: criteria,
      };
    })
    .filter((r): r is Omit<CandidateRanking, 'percentileRank'> => r !== null);

  const sortedData = unsortedRankingData.sort((a, b) => b.aggregatedScore - a.aggregatedScore);
  const totalCandidates = sortedData.length;

  const rankingData: CandidateRanking[] = sortedData.map((candidate, index) => {
    const rank = index + 1;
    const percentileRank = totalCandidates > 0 ? Math.ceil((rank / totalCandidates) * 100) : 0;
    return {
      ...candidate,
      percentileRank,
    }
  });


  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Candidate Rankings
          </h2>
          <p className="text-muted-foreground">
            Global leaderboard based on aggregated evaluation scores and percentile ranks.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>
            Candidates are ranked based on a weighted average of their performance across all tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RankingList data={rankingData} schemas={allSchemas} />
        </CardContent>
      </Card>
    </div>
  );
}
