/**
 * Payment Modal Component
 * Handles CyberSource, PayPal, and Offline payment processing
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building, Wallet, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  c3HeaderId: string;
  companyId?: string;
  selfEmployedProfileId?: string;
  amount: number;
  breakdown: {
    ssTotal: number;
    levyTotal: number;
    peTotal: number;
    penalties: number;
  };
  onPaymentComplete: () => void;
}

type PaymentMethod = 'cybersource' | 'paypal' | 'offline';
type OfflineType = 'bank_transfer' | 'check' | 'cash' | 'journal_voucher';

export function PaymentModal({
  open,
  onOpenChange,
  c3HeaderId,
  amount,
  breakdown,
  onPaymentComplete,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cybersource');
  const [offlineType, setOfflineType] = useState<OfflineType>('bank_transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Offline payment fields
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
    }).format(value);
  };

  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    return `C3WIZ-${timestamp.toString().slice(-6)}`;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const receiptNumber = generateReceiptNumber();
      
      if (paymentMethod === 'cybersource') {
        // Simulate CyberSource payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In production, this would redirect to CyberSource Secure Acceptance
        // Payment would be recorded via webhook callback
        console.log('CyberSource payment simulated:', {
          c3headerid: c3HeaderId,
          amount,
          receipt: receiptNumber,
          breakdown,
        });

        toast.success(`Payment authorized. Receipt: ${receiptNumber}`);
        
      } else if (paymentMethod === 'paypal') {
        // Simulate PayPal payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // PayPal payment simulation
        console.log('PayPal payment for C3:', c3HeaderId, 'Amount:', amount, 'Receipt:', receiptNumber);

        toast.success(`PayPal payment completed. Receipt: ${receiptNumber}`);
        
      } else if (paymentMethod === 'offline') {
        if (!referenceNumber) {
          toast.error('Please enter a reference number');
          setIsProcessing(false);
          return;
        }

        const offlineModeMap: Record<OfflineType, string> = {
          bank_transfer: 'Bank Transfer',
          check: 'Check',
          cash: 'Cash',
          journal_voucher: 'Journal Voucher',
        };
        
        // Offline payment recording
        console.log('Offline payment recorded:', {
          c3headerid: c3HeaderId,
          mode: offlineModeMap[offlineType],
          amount,
          receipt: receiptNumber,
          bankname: bankName,
          reference: referenceNumber,
        });

        toast.success(`Offline payment recorded. Receipt: ${receiptNumber}`);
      }

      setPaymentComplete(true);
      
      // Reset form and close after delay
      setTimeout(() => {
        onPaymentComplete();
        onOpenChange(false);
        setPaymentComplete(false);
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPaymentMethod('cybersource');
    setOfflineType('bank_transfer');
    setReferenceNumber('');
    setBankName('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  if (paymentComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-[#1a5c4c]">Payment Successful!</h2>
            <p className="text-muted-foreground mt-2">Your C3 contribution has been processed.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#1a5c4c]">Process Payment</DialogTitle>
          <DialogDescription>
            Complete your C3 contribution payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <h3 className="font-medium mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Social Security</span>
                  <span>{formatCurrency(breakdown.ssTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Levy</span>
                  <span>{formatCurrency(breakdown.levyTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Severance Pay</span>
                  <span>{formatCurrency(breakdown.peTotal)}</span>
                </div>
                {breakdown.penalties > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Penalties</span>
                    <span>{formatCurrency(breakdown.penalties)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Due</span>
                  <span className="text-[#1a5c4c]">{formatCurrency(amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="cybersource" id="cybersource" />
                <CreditCard className="h-5 w-5 text-[#1a5c4c]" />
                <Label htmlFor="cybersource" className="cursor-pointer flex-1">
                  Credit/Debit Card (CyberSource)
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="paypal" id="paypal" />
                <Wallet className="h-5 w-5 text-blue-600" />
                <Label htmlFor="paypal" className="cursor-pointer flex-1">
                  PayPal
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="offline" id="offline" />
                <Building className="h-5 w-5 text-gray-600" />
                <Label htmlFor="offline" className="cursor-pointer flex-1">
                  Offline Payment
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Offline Payment Details */}
          {paymentMethod === 'offline' && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={offlineType} onValueChange={(v) => setOfflineType(v as OfflineType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="journal_voucher">Journal Voucher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Reference / Check Number *</Label>
                <Input
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter reference number"
                />
              </div>

              {(offlineType === 'bank_transfer' || offlineType === 'check') && (
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-[#45a049] hover:bg-[#3d8b40]"
          >
            {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {paymentMethod === 'offline' ? 'Record Payment' : `Pay ${formatCurrency(amount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
