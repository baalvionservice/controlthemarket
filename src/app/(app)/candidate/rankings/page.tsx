import {
  getUsers,
  getSubmissions,
  getEvaluations,
  getTasks,
} from '@/lib/api';
import type { User, Evaluation, Submission, RoleCategory, Task } from '@/lib/types';
import { CandidateRankingClientPage } from './ranking-client-page';

// Reusing a similar ranking type from the admin dashboard
export type CandidateRanking = {
  rank: number;
  candidate: User;
  aggregatedScore: number;
  primaryRole?: RoleCategory;
  tasksCompleted: number;
};

// Reusing aggregation logic from admin side for consistency
const calculateAggregatedScore = (evaluations: Evaluation[]): number => {
  if (evaluations.length === 0) return 0;
  const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0);
  return Math.round(totalScore / evaluations.length);
};

export default async function RankingsPage() {
    const [allUsers, allSubmissions, allEvaluations, allTasks] = await Promise.all([
        getUsers(),
        getSubmissions(),
        getEvaluations(),
        getTasks(),
    ]);

    const candidates = allUsers.filter((u) => u.role === 'candidate');

    const unsortedRankingData = candidates
        .map((candidate) => {
            const candidateSubmissions = allSubmissions.filter(
                (sub) => sub.userId === candidate.id && sub.status !== 'in-progress' && sub.status !== 'assigned'
            );

            if (candidateSubmissions.length === 0) {
                return null;
            }

            const candidateSubmissionIds = new Set(candidateSubmissions.map((s) => s.id));
            const candidateEvaluations = allEvaluations.filter((ev) =>
                candidateSubmissionIds.has(ev.submissionId)
            );
            
            if (candidateEvaluations.length === 0) {
                return null;
            }

            const score = calculateAggregatedScore(candidateEvaluations);
            
            const taskIds = new Set(candidateSubmissions.map((s) => s.taskId));
            const candidateTasks = allTasks.filter((t) => taskIds.has(t.id));
            let primaryRole: RoleCategory | undefined;
            if (candidateTasks.length > 0) {
                const roleCounts = candidateTasks.reduce((acc, task) => {
                acc[task.roleCategory] = (acc[task.roleCategory] || 0) + 1;
                return acc;
                }, {} as Record<string, number>);
                primaryRole = Object.keys(roleCounts).reduce((a, b) =>
                roleCounts[a] > roleCounts[b] ? a : b
                ) as RoleCategory;
            }

            return {
                candidate,
                aggregatedScore: score,
                primaryRole,
                tasksCompleted: candidateSubmissions.length,
            };
        })
        .filter((r): r is Omit<CandidateRanking, 'rank'> => r !== null);
    
    const leaderboardData: CandidateRanking[] = unsortedRankingData
        .sort((a, b) => b.aggregatedScore - a.aggregatedScore)
        .map((data, index) => ({
            ...data,
            rank: index + 1,
        }));

    return <CandidateRankingClientPage initialData={leaderboardData} />;
}
