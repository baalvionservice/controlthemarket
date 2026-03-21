'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Video, Mic, StopCircle, Radio, Download, UploadCloud, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'uploading';

export function LivestreamPanel() {
    const { toast } = useToast();
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            // Cleanup stream on component unmount
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const getPermissionsAndStream = async () => {
        if (stream) return stream;
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            return mediaStream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            toast({
                title: "Permissions Denied",
                description: "Camera and microphone access is required to start a livestream.",
                variant: "destructive",
            });
            return null;
        }
    };
    
    const startLivestream = async () => {
        const mediaStream = await getPermissionsAndStream();
        if (!mediaStream) return;

        setRecordedBlob(null);
        chunksRef.current = [];
        const options = { mimeType: 'video/webm; codecs=vp8,opus' };
        const mediaRecorder = new MediaRecorder(mediaStream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
                // Optional: real-time upload can be implemented here.
                // For this mock, we just collect chunks and log their size.
                console.log(`Collected chunk of size: ${event.data.size}`);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecordedBlob(blob);
            setStatus('recorded');
            toast({ title: "Livestream Ended", description: "You can now upload the recording." });
            // Stop the camera/mic tracks
             if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setStream(null);
        };

        mediaRecorder.start(1000); // Trigger ondataavailable every 1 second for chunk simulation
        setStatus('recording');
        toast({ title: "Livestream Started..." });
    };

    const stopLivestream = () => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleUpload = async () => {
        if (!recordedBlob) return;

        setStatus('uploading');
        toast({ title: "Uploading recording...", description: "This is a mock upload." });

        const formData = new FormData();
        formData.append('file', recordedBlob, 'livestream-recording.webm');
        
        // Mocking the fetch call to /upload-livestream
        console.log("Mock upload started with FormData:", formData.get('file'));
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResponse = {
            success: true,
            file: `private-recordings/livestream-recording-${Date.now()}.webm`,
        };
        console.log("Mock upload complete:", mockResponse);
        
        setStatus('idle');
        setRecordedBlob(null);
        toast({ title: "Upload complete!", description: `Recording saved to ${mockResponse.file}.` });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> Livestream Studio</CardTitle>
                <CardDescription>Record a live session or presentation. Recordings are stored privately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                    <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                    {status === 'idle' && !stream && <p className="text-sm text-muted-foreground">Camera is off</p>}
                    {status === 'recording' && (
                        <div className="absolute top-2 right-2 flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                            <Radio className="h-3 w-3 animate-pulse" />
                            LIVE
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    {(status === 'idle' || status === 'recorded') && (
                        <Button onClick={startLivestream} size="lg">
                            <Mic className="mr-2 h-4 w-4"/> {recordedBlob ? 'Record Again' : 'Start Livestream'}
                        </Button>
                    )}
                    {status === 'recording' && (
                        <Button onClick={stopLivestream} size="lg" variant="destructive">
                            <StopCircle className="mr-2 h-4 w-4"/> Stop Livestream
                        </Button>
                    )}
                     {status === 'recorded' && recordedBlob && (
                         <div className="w-full flex gap-2">
                             <Button onClick={handleUpload} className="flex-1">
                                <UploadCloud className="mr-2 h-4 w-4" /> Upload Recording
                            </Button>
                             <Button asChild variant="secondary" className="flex-1">
                                 <a href={URL.createObjectURL(recordedBlob)} download="livestream.webm">
                                    <Download className="mr-2 h-4 w-4"/> Download
                                 </a>
                            </Button>
                         </div>
                     )}
                     {status === 'uploading' && (
                         <Button disabled size="lg">
                             <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...
                         </Button>
                     )}
                </div>
            </CardContent>
        </Card>
    )
}
