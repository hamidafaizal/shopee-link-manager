// ========== FILTER RESULTS (app/components/Navbar1/FilterResults.tsx) ==========
'use client';

import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface FilterResultsProps {
  data: any[];
  onReset: () => void;
  onSendToNavbar3: () => void;
}

export default function FilterResults({ data, onReset, onSendToNavbar3 }: FilterResultsProps) {
  const [copiedBatch, setCopiedBatch] = useState<number | null>(null);
  const batchSize = 100;
  const batches = Math.ceil(data.length / batchSize);

  const copyBatchLinks = (batchIndex: number) => {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, data.length);
    const links = data.slice(start, end).map(item => item.productLink).join('\n');
    
    navigator.clipboard.writeText(links);
    setCopiedBatch(batchIndex);
    toast.success(`Batch ${batchIndex + 1} berhasil dicopy!`);
    
    setTimeout(() => setCopiedBatch(null), 2000);
  };

  const allCommissionsFilled = data.every(item => item.commission);

  return (
    <GlassCard className="p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          Hasil Filter ({data.length} link)
        </h3>
        <AnimatedButton
          onClick={onReset}
          variant="secondary"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </AnimatedButton>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-white/80">No</th>
              <th className="text-left py-3 px-4 text-white/80">Link Produk</th>
              <th className="text-left py-3 px-4 text-white/80">Komisi</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/10"
              >
                <td className="py-3 px-4 text-white/60">{index + 1}</td>
                <td className="py-3 px-4">
                  <a 
                    href={item.productLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 truncate block max-w-md"
                  >
                    {item.productLink}
                  </a>
                </td>
                <td className="py-3 px-4 text-white/60">
                  {item.commission || '-'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {data.length > 10 && (
          <p className="text-center py-4 text-white/50">
            ... dan {data.length - 10} link lainnya
          </p>
        )}
      </div>

      {/* Batch Actions */}
      <div className="mt-6 space-y-3">
        <h4 className="text-white/80 font-medium">Copy Batch:</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: batches }).map((_, index) => {
            const start = index * batchSize + 1;
            const end = Math.min((index + 1) * batchSize, data.length);
            
            return (
              <AnimatedButton
                key={index}
                onClick={() => copyBatchLinks(index)}
                variant={copiedBatch === index ? 'primary' : 'secondary'}
                className="text-sm"
              >
                <Copy className="w-4 h-4 mr-1" />
                {start}-{end}
              </AnimatedButton>
            );
          })}
        </div>
      </div>

      {/* Send to Navbar 3 */}
      {allCommissionsFilled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <AnimatedButton
            onClick={onSendToNavbar3}
            className="w-full"
          >
            KIRIM KE DISTRIBUSI
          </AnimatedButton>
        </motion.div>
      )}
    </GlassCard>
  );
}