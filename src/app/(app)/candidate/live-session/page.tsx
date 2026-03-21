
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share, StopCircle, Radio, MonitorOff, Loader2, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { useSubmissions } from '@/contexts/submissions-context';
import type { LiveSessionStatus } from '@/lib/types';
import { SkillMatchResultPanel } from '../submissions/[id]/skill-match-result-panel';

const getStatusVariant = (status?: LiveSessionStatus): 'default' | 'destructive' | 'warning' | 'outline' | 'secondary' => {
    switch (status) {
      case 'Active': return 'default';
      case 'Cancelled': 
      case 'Completed':
        return 'secondary';
      case 'Paused': return 'warning';
      case 'Scheduled': return 'warning';
      default: return 'outline';
    }
  };

export default function CandidateLiveSessionPage() {
  const { user } = useAuth();
  const { submissions, updateSubmission } = useSubmissions();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  // Find the active or scheduled session for the current user
  const submission = useMemo(() => {
    if (!user) return null;
    return submissions.find(s => 
        s.userId === user.id && 
        ['Active', 'Scheduled', 'Paused'].includes(s.liveSessionStatus || 'Not Started')
    ) || null;
  }, [submissions, user]);

  const handleStartSharing = async () => {
    if (!submission) {
        toast({ title: "No active session found.", variant: 'destructive' });
        return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      mediaStream.getVideoTracks()[0].onended = () => {
          handleStopSharing(submission.id, false);
      };

      updateSubmission(submission.id, { liveSessionStatus: 'Active' });
      
      toast({
        title: 'Session Started',
        description: 'You are now sharing your screen.',
      });
    } catch (error) {
      console.error('Error accessing screen:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Screen Share Failed',
        description: 'Could not start screen sharing. Please check your browser permissions.',
      });
    }
  };

  const handleStopSharing = (submissionId: string, showToast = true) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setStream(null);
    updateSubmission(submissionId, { liveSessionStatus: 'Completed' });

    if (showToast) {
        toast({
          title: 'Session Ended',
          description: 'You have stopped sharing your screen.',
        });
    }
  };

  if (!user) {
    return <div className="flex h-full w-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!submission) {
      return (
           <div className="flex-1 space-y-6 p-8 pt-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                    Live Screen Sharing Session
                </h2>
                 <Card>
                    <CardHeader>
                        <CardTitle>No Active Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">There are no live coding sessions scheduled for you at this time.</p>
                    </CardContent>
                </Card>
           </div>
      );
  }

  const sessionStatus = submission.liveSessionStatus || 'Not Started';

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Live Screen Sharing Session
          </h2>
          <p className="text-muted-foreground">
            Share your screen with the evaluation team in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Session Control Panel</CardTitle>
                <CardDescription>
                    Use the controls below to manage your screen sharing session.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                    <span className="font-medium">Session Status:</span>
                    <Badge variant={getStatusVariant(sessionStatus)} className="text-lg capitalize">
                        {sessionStatus === 'Active' && <Radio className="mr-2 h-4 w-4 animate-pulse" />}
                        {sessionStatus}
                    </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Session ID: {submission.id}</p>
                </div>
                
                {!hasPermission && (
                  <Alert variant="destructive">
                      <AlertTitle>Screen Share Permission Denied</AlertTitle>
                      <AlertDescription>
                        Please enable screen sharing permissions in your browser settings to continue.
                      </AlertDescription>
                  </Alert>
                )}

                <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                    <video ref={videoRef} className="h-full w-full object-contain" autoPlay muted playsInline />
                    {sessionStatus !== 'Active' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                           {sessionStatus === 'Paused' ? (
                                <>
                                    <Pause className="h-16 w-16 text-muted-foreground" />
                                    <p className="mt-4 text-muted-foreground text-center">
                                        Your session has been paused by the admin.
                                    </p>
                                </>
                           ) : (
                             <>
                                <MonitorOff className="h-16 w-16 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground text-center">
                                    {sessionStatus === 'Completed' ? 'Your session has ended.' : 'Your screen is not being shared.'}
                                </p>
                             </>
                           )}
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                    size="lg"
                    onClick={handleStartSharing}
                    disabled={sessionStatus === 'Active' || sessionStatus === 'Completed'}
                    >
                    <Share className="mr-2 h-5 w-5" />
                    Start Sharing
                    </Button>
                    <Button
                    size="lg"
                    variant="destructive"
                    onClick={() => handleStopSharing(submission.id)}
                    disabled={!['Active', 'Paused'].includes(sessionStatus)}
                    >
                    <StopCircle className="mr-2 h-5 w-5" />
                    Stop Sharing
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             {sessionStatus === 'Completed' && (
                <SkillMatchResultPanel submission={submission} />
            )}
        </div>
      </div>
    </div>
  );
}
