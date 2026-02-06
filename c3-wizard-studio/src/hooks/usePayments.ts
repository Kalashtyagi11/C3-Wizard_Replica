/**
 * Payment Processing Hook
 * Connects to optimised c3_payments table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbPayment = Database['public']['Tables']['c3_payments']['Row'];
export type Payment = DbPayment;

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async (contributionHeaderId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('c3_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contributionHeaderId) {
        query = query.eq('contribution_header_id', contributionHeaderId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setPayments(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(message);
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllPayments = useCallback(async () => {
    return fetchPayments();
  }, [fetchPayments]);

  const fetchPaymentsByCompany = useCallback(async (companyId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Payments are linked via contribution_header_id, need to join through c3_contribution_headers
      const { data: headers } = await supabase
        .from('c3_contribution_headers')
        .select('id')
        .eq('company_id', companyId);
      
      if (headers && headers.length > 0) {
        const headerIds = headers.map(h => h.id);
        const { data, error: fetchError } = await supabase
          .from('c3_payments')
          .select('*')
          .in('contribution_header_id', headerIds)
          .order('created_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        setPayments(data || []);
      } else {
        setPayments([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(message);
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPayment = async (paymentData: Partial<Payment>) => {
    try {
      const insertData = {
        amount: paymentData.amount ?? 0,
        ...paymentData,
        created_at: new Date().toISOString(),
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_payments')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return { payment: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      return { payment: null, error: message };
    }
  };

  const processOnlinePayment = async (
    contributionHeaderId: number,
    amount: number,
    method: 'credit_card' | 'debit_card',
    _companyId?: number,
    _selfEmpId?: number
  ) => {
    try {
      // Generate transaction reference
      const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const paymentData: Database['public']['Tables']['c3_payments']['Insert'] = {
        contribution_header_id: contributionHeaderId,
        amount: amount,
        payment_method: method,
        payment_status: 'Pending',
        system_transaction_id: transactionRef,
        currency: 'XCD',
        created_at: new Date().toISOString(),
        created_by: 1, // System user
      };
      
      const { data: payment, error: insertError } = await supabase
        .from('c3_payments')
        .insert(paymentData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Simulate payment gateway processing
      const isSuccess = Math.random() > 0.1; // 90% success rate for simulation
      
      const updateData = {
        payment_status: isSuccess ? 'Completed' : 'Failed',
        error_message: isSuccess ? null : 'Transaction Declined',
        payment_gateway_transaction_id: isSuccess ? `GW-${Date.now()}` : null,
        payment_completed_at: isSuccess ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      await supabase
        .from('c3_payments')
        .update(updateData)
        .eq('id', payment.id);
      
      if (isSuccess) {
        // Update C3 header payment status
        await supabase
          .from('c3_contribution_headers')
          .update({
            is_submitted: true,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', contributionHeaderId);
      }
      
      return { 
        success: isSuccess, 
        payment: { ...payment, ...updateData },
        error: isSuccess ? null : 'Payment declined' 
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payment';
      return { success: false, payment: null, error: message };
    }
  };

  const processOfflinePayment = async (
    contributionHeaderId: number,
    paymentData: {
      amount: number;
      method: 'cash' | 'check' | 'bank_transfer';
      checkNumber?: string;
      bankName?: string;
      transactionRef?: string;
    },
    _companyId?: number,
    _selfEmpId?: number
  ) => {
    try {
      const insertData: Database['public']['Tables']['c3_payments']['Insert'] = {
        contribution_header_id: contributionHeaderId,
        amount: paymentData.amount,
        payment_method: paymentData.method,
        payment_status: 'Completed',
        system_transaction_id: paymentData.transactionRef ?? `OFF-${Date.now()}`,
        currency: 'XCD',
        created_at: new Date().toISOString(),
        created_by: 1,
      };
      
      const { data: payment, error: insertError } = await supabase
        .from('c3_payments')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Update C3 header payment status
      await supabase
        .from('c3_contribution_headers')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contributionHeaderId);
      
      return { payment, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process offline payment';
      return { payment: null, error: message };
    }
  };

  const reconcilePayment = async (paymentId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_payments')
        .update({
          is_reconciled: true,
          reconciled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);
      
      if (updateError) throw updateError;
      
      await fetchAllPayments();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reconcile payment';
      return { error: message };
    }
  };

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    fetchAllPayments,
    fetchPaymentsByCompany,
    createPayment,
    processOnlinePayment,
    processOfflinePayment,
    reconcilePayment,
  };
}
