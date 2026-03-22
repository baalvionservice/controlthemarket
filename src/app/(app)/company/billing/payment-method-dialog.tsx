
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Save } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PaymentMethodDialog({ isOpen, onOpenChange }: PaymentMethodDialogProps) {
    const { toast } = useToast();
    const [cardNumber, setCardNumber] = useState('**** **** **** 1234');
    const [expiry, setExpiry] = useState('12/26');
    const [cvc, setCvc] = useState('***');

    const handleSaveChanges = () => {
        toast({
            title: "Payment Method Updated",
            description: "Your new payment method has been saved."
        });
        onOpenChange(false);
    }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Enter your new credit card details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="card-number" placeholder="**** **** **** ****" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="pl-10" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
