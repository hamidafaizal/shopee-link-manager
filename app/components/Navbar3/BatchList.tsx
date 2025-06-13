// ========== BATCH LIST (app/components/Navbar3/BatchList.tsx) ==========
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface Batch {
  id: number;
  links: string[];
  isFull: boolean;
}

interface BatchListProps {
  batches: Batch[];
  phones: { id: number; name: string; whatsapp_number: string }[];
  onDistribute: (batchId: number, phoneId: number) => Promise<void>;
}

export default function BatchList({ batches, phones, onDistribute }: BatchListProps) {
  const [selectedPhones, setSelectedPhones] = useState<{[key: number]: number}>({});
  const [distributing, setDistributing] = useState<number | null>(null);
  const [distributed, setDistributed] = useState<number[]>([]);

  const handleDistribute = async (batchId: number) => {
    const phoneId = selectedPhones[batchId];
    if (!phoneId) return;

    setDistributing(batchId);
    try {
      await onDistribute(batchId, phoneId);
      setDistributed([...distributed, batchId]);
    } finally {
      setDistributing(null);
    }
  };

  const getWhatsAppUrl = (phoneNumber: string, links: string[]) => {
    const message = links.join('\n');
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {batches.map((batch, index) => {
          const isDistributed = distributed.includes(batch.id);
          if (isDistributed) return null;

          return (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Batch {index + 1}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {batch.links.length} / 100 links
                    </p>
                  </div>
                  
                  {batch.isFull ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">
                        Kurang {100 - batch.links.length} link lagi
                      </span>
                    </div>
                  )}
                </div>

                {batch.isFull && (
                  <div className="flex gap-3">
                    <select
                      value={selectedPhones[batch.id] || ''}
                      onChange={(e) => setSelectedPhones({
                        ...selectedPhones,
                        [batch.id]: parseInt(e.target.value)
                      })}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="">Pilih HP Tujuan</option>
                      {phones.map(phone => (
                        <option key={phone.id} value={phone.id}>
                          {phone.name} - {phone.whatsapp_number}
                        </option>
                      ))}
                    </select>
                    
                    <AnimatedButton
                      onClick={() => handleDistribute(batch.id)}
                      disabled={!selectedPhones[batch.id]}
                      isLoading={distributing === batch.id}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      KIRIM
                    </AnimatedButton>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {batches.length === 0 && (
        <div className="text-center py-8 text-white/50">
          Belum ada batch link yang masuk
        </div>
      )}
    </div>
  );
}