// ========== NAVBAR 1: UPLOAD CSV (app/components/Navbar1/UploadCSV.tsx) ==========
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface CSVData {
  productLink: string;
  Tren: string;
  isAd: string;
  'Penjualan (30 Hari)': number;
  [key: string]: any;
}

export default function UploadCSV({ onDataProcessed }: { onDataProcessed: (data: any[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [rank, setRank] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: true
  });

  const processFiles = async () => {
    setIsProcessing(true);
    const allResults: CSVData[] = [];

    try {
      for (const file of files) {
        const text = await file.text();
        const { data } = Papa.parse<CSVData>(text, { 
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        // Filter sesuai aturan
        const filtered = data.filter(row => row.Tren !== 'TURUN');
        const adsYes = filtered.filter(row => row.Tren === 'NAIK' && row.isAd === 'Yes');
        const adsNo = filtered
          .filter(row => row.Tren === 'NAIK' && row.isAd === 'No')
          .sort((a, b) => b['Penjualan (30 Hari)'] - a['Penjualan (30 Hari)'])
          .slice(0, rank);

        allResults.push(...adsYes, ...adsNo);
      }

      // Shuffle dan remove duplicates
      const shuffled = shuffleArray(allResults);
      const unique = removeDuplicates(shuffled, 'productLink');

      onDataProcessed(unique);
      toast.success(`Berhasil memproses ${unique.length} link unik!`);
      setFiles([]);
    } catch (error) {
      toast.error('Gagal memproses file CSV');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload CSV</h2>
      
      {/* Rank Input */}
      <div className="mb-6">
        <label className="block text-white/80 mb-2">Jumlah Rank (Top Products)</label>
        <input
          type="number"
          value={rank}
          onChange={(e) => setRank(parseInt(e.target.value) || 10)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          min="1"
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-white/30 hover:border-white/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
        <p className="text-white/80">
          {isDragActive ? 'Drop file CSV di sini...' : 'Drag & drop file CSV atau klik untuk browse'}
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-white/60" />
                  <span className="text-white/80">{file.name}</span>
                  <span className="text-white/50 text-sm">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Button */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <AnimatedButton
            onClick={processFiles}
            isLoading={isProcessing}
            className="w-full"
          >
            PROSES
          </AnimatedButton>
        </motion.div>
      )}
    </GlassCard>
  );
}

// Helper functions (should be imported from utils)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}