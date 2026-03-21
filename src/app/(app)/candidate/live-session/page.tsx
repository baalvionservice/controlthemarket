'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share, StopCircle, Radio, MonitorOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type SessionStatus = 'Idle' | 'Sharing' | 'Stopped';

export default function CandidateLiveSessionPage() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('Idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStartSharing = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      mediaStream.getVideoTracks()[0].onended = () => {
          handleStopSharing(false); // Stop if user clicks browser's "Stop sharing" button
      };
      setSessionStatus('Sharing');
      setSessionId(`session_${Math.random().toString(36).substr(2, 9)}`);
      toast({
        title: 'Session Started',
        description: 'You are now sharing your screen.',
      });
    } catch (error) {
      console.error('Error accessing screen:', error);
      toast({
        variant: 'destructive',
        title: 'Screen Share Failed',
        description: 'Could not start screen sharing. Please check your browser permissions.',
      });
    }
  };

  const handleStopSharing = (showToast = true) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setStream(null);
    setSessionStatus('Stopped');
    if (showToast) {
        toast({
          title: 'Session Ended',
          description: 'You have stopped sharing your screen.',
        });
    }
  };

  const getStatusVariant = () => {
    switch (sessionStatus) {
      case 'Sharing': return 'default';
      case 'Stopped': return 'destructive';
      default: return 'secondary';
    }
  };

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
              <Badge variant={getStatusVariant()} className="text-lg">
                {sessionStatus === 'Sharing' && <Radio className="mr-2 h-4 w-4 animate-pulse" />}
                {sessionStatus}
              </Badge>
            </div>
            {sessionId && <p className="text-sm text-muted-foreground">Session ID: {sessionId}</p>}
          </div>

          <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
            <video ref={videoRef} className="h-full w-full object-contain" autoPlay muted playsInline />
            {sessionStatus !== 'Sharing' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                    <MonitorOff className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Your screen is not being shared</p>
                </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={handleStartSharing}
              disabled={sessionStatus === 'Sharing'}
            >
              <Share className="mr-2 h-5 w-5" />
              Start Sharing
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => handleStopSharing()}
              disabled={sessionStatus !== 'Sharing'}
            >
              <StopCircle className="mr-2 h-5 w-5" />
              Stop Sharing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
