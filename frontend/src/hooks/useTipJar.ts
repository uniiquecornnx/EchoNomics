'use client';
import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { TIP_JAR_CONTRACT, TIP_JAR_ADDRESSES } from '../../lib/contracts';
import { supabase } from '../../lib/supabaseClient';

interface TipData {
  streamerAddress: string;
  message: string;
  amount: string; // in ETH
}

interface StreamerInfo {
  id: string;
  title: string;
  slug: string;
  wallet_address: string;
}

export function useTipJar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentTips, setRecentTips] = useState<any[]>([]);

  // Wagmi hooks
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Fetch streamer's wallet address from Supabase by stream ID or slug
   */
  const getStreamerAddress = useCallback(async (streamId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('wallet_address')
        .eq('id', streamId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch streamer address: ${error.message}`);
      }

      if (!data?.wallet_address) {
        throw new Error('Streamer wallet address not found');
      }

      return data.wallet_address;
    } catch (err) {
      console.error('Error fetching streamer address:', err);
      throw err;
    }
  }, []);

  /**
   * Get streamer info by stream ID
   */
  const getStreamerInfo = useCallback(async (streamId: string): Promise<StreamerInfo> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('id, title, slug, wallet_address')
        .eq('id', streamId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch streamer info: ${error.message}`);
      }

      if (!data) {
        throw new Error('Stream not found');
      }

      return data;
    } catch (err) {
      console.error('Error fetching streamer info:', err);
      throw err;
    }
  }, []);

  /**
   * Send tip to streamer using TipJar contract
   */
  const sendTip = useCallback(async (tipData: TipData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!tipData.streamerAddress) {
        throw new Error('Streamer address is required');
      }
      if (!tipData.message.trim()) {
        throw new Error('Message is required');
      }
      if (!tipData.amount || parseFloat(tipData.amount) <= 0) {
        throw new Error('Tip amount must be greater than 0');
      }

      // Convert ETH to Wei
      const amountWei = parseEther(tipData.amount);

      // Write contract transaction
      await writeContract({
        address: TIP_JAR_CONTRACT.address,
        abi: TIP_JAR_CONTRACT.abi,
        functionName: 'sendTip',
        args: [tipData.streamerAddress as `0x${string}`, tipData.message],
        value: amountWei,
      });

      console.log('Tip transaction submitted:', hash);

    } catch (err) {
      console.error('Failed to send tip:', err);
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [writeContract, hash]);

  /**
   * Send tip by stream ID (automatically fetches streamer address)
   */
  const sendTipByStreamId = useCallback(async (
    streamId: string,
    message: string,
    amount: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get streamer address from Supabase
      const streamerAddress = await getStreamerAddress(streamId);
      
      // Send tip
      await sendTip({
        streamerAddress,
        message,
        amount,
      });

    } catch (err) {
      console.error('Failed to send tip by stream ID:', err);
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getStreamerAddress, sendTip]);

  /**
   * Send tip by stream slug (automatically fetches streamer address)
   */
  const sendTipByStreamSlug = useCallback(async (
    streamSlug: string,
    message: string,
    amount: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get streamer info from Supabase
      const { data, error } = await supabase
        .from('streams')
        .select('wallet_address')
        .eq('slug', streamSlug)
        .single();

      if (error) {
        throw new Error(`Failed to fetch streamer address: ${error.message}`);
      }

      if (!data?.wallet_address) {
        throw new Error('Streamer wallet address not found');
      }

      // Send tip
      await sendTip({
        streamerAddress: data.wallet_address,
        message,
        amount,
      });

    } catch (err) {
      console.error('Failed to send tip by stream slug:', err);
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sendTip]);

  /**
   * Get recent tips for a stream
   */
  const getRecentTips = useCallback(async (streamId: string) => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Supabase error fetching tips:', error);
        // Return empty array instead of throwing error
        setRecentTips([]);
        return [];
      }

      setRecentTips(data || []);
      return data || [];
    } catch (err) {
      console.error('Failed to get recent tips:', err);
      // Return empty array instead of throwing error
      setRecentTips([]);
      return [];
    }
  }, []);

  return {
    // State
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || (writeError ? writeError.message : null),
    hash,
    recentTips,

    // Actions
    sendTip,
    sendTipByStreamId,
    sendTipByStreamSlug,
    getStreamerAddress,
    getStreamerInfo,
    getRecentTips,

    // Utilities
    isTransactionPending: isPending || isConfirming,
    isTransactionSuccess: isConfirmed,
  };
}
