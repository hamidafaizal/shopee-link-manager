// ========== NAVBAR 3: THRESHOLD INPUT (app/components/Navbar3/ThresholdInput.tsx) ==========
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface ThresholdInputProps {
  onThresholdSet: (threshold: number) => void;
}

export default function ThresholdInput({ onThresholdSet }: ThresholdInputProps) {
  const [threshold, setThreshold] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(threshold);
    if (value > 0) {
      onThresholdSet(value);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-white/80" />
        <h2 className="text-2xl font-bold text-white">Set Threshold</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 mb-2">
            Jumlah Link Threshold
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            placeholder="Contoh: 300"
            min="1"
            required
          />
          <p className="text-white/50 text-sm mt-2">
            Tentukan jumlah maksimal link yang akan diproses
          </p>
        </div>
        
        <AnimatedButton type="submit" className="w-full">
          SET THRESHOLD
        </AnimatedButton>
      </form>
    </GlassCard>
  );
}