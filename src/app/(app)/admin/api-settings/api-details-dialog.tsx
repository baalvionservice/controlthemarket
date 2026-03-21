
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TestTube2, Save } from 'lucide-react';
import type { ApiIntegration } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ApiDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  apiIntegration: ApiIntegration | null;
}

export function ApiDetailsDialog({ isOpen, onOpenChange, apiIntegration }: ApiDetailsDialogProps) {
  const { toast } = useToast();
  // We can use state to manage form fields if we want to make them editable
  const [apiKey, setApiKey] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');

  useEffect(() => {
    if (apiIntegration) {
      setApiKey(apiIntegration.apiKey);
      setEndpointUrl(apiIntegration.endpointUrl);
    }
  }, [apiIntegration]);

  const handleTestConnection = () => {
    toast({
        title: 'Test Connection (Mock)',
        description: `Sending a test request to ${apiIntegration?.name}...`
    });
     setTimeout(() => {
        toast({ title: 'Test Successful', description: `Successfully received a 200 OK response from ${apiIntegration?.name}.` });
    }, 1500)
  }

  if (!apiIntegration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">API Settings: {apiIntegration.name}</DialogTitle>
          <DialogDescription>
            {apiIntegration.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 mt-4">
            <div className="space-y-2">
                <Label htmlFor="api-key">API Key / Token</Label>
                <Input id="api-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="endpoint-url">Endpoint URL</Label>
                <Input id="endpoint-url" value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} />
            </div>
             <div>
                <h4 className="font-medium mb-2">Subscribed Events</h4>
                <div className="flex flex-wrap gap-2">
                    {apiIntegration.subscribedEvents.map(event => <Badge key={event} variant="secondary">{event}</Badge>)}
                </div>
            </div>
             <div>
                 <h4 className="font-medium mb-2">Mock Test Run Results</h4>
                <div className="rounded-md border p-3 text-sm bg-muted text-muted-foreground font-mono">
                    <p>Last Test: <span className="text-foreground">Success (200 OK)</span></p>
                    <p>Latency: <span className="text-foreground">120ms</span></p>
                </div>
            </div>
        </div>
        <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleTestConnection}><TestTube2 className="mr-2 h-4 w-4" /> Test Connection</Button>
            <Button><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
