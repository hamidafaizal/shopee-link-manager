// ========== NAVBAR 2: UPLOAD SCREENSHOT (app/components/Navbar2/UploadScreenshot.tsx) ==========
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface UploadScreenshotProps {
  currentBatch: number;
  totalBatches: number;
  onAnalyze: (imageBase64: string) => Promise<any>;
  onApprove: (commissions: any[]) => void;
}

export default function UploadScreenshot({ 
  currentBatch, 
  totalBatches, 
  onAnalyze, 
  onApprove 
}: UploadScreenshotProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
        setAnalysisResult([]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await onAnalyze(image);
      
      // Validate result
      if (result.some((item: any) => item.commission === 'error')) {
        setError('AI gagal membaca beberapa komisi. Silakan upload ulang gambar yang lebih jelas.');
        return;
      }

      if (result.length !== 4) {
        setError(`Screenshot harus berisi tepat 4 produk. Terdeteksi: ${result.length} produk.`);
        return;
      }

      setAnalysisResult(result);
      toast.success('Analisa berhasil!');
    } catch (err) {
      setError('Gagal menganalisa gambar. Silakan coba lagi.');
      toast.error('Gagal menganalisa gambar');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprove = () => {
    onApprove(analysisResult);
    setImage(null);
    setAnalysisResult([]);
    setError(null);
    toast.success('Data komisi berhasil disimpan!');
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Screenshot Komisi</h2>
      
      {/* Progress Info */}
      <div className="mb-6 p-4 bg-blue-500/20 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-white/80">Progress Batch:</span>
          <span className="text-white font-semibold">
            Batch {currentBatch} dari {totalBatches}
          </span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentBatch / totalBatches) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Upload Area */}
      {!image && (
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
            {isDragActive ? 'Drop screenshot di sini...' : 'Upload screenshot produk (4 produk/gambar)'}
          </p>
          <p className="text-white/50 text-sm mt-2">
            Format: JPG, PNG
          </p>
        </div>
      )}

      {/* Image Preview */}
      {image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <img 
            src={image} 
            alt="Screenshot" 
            className="w-full rounded-lg shadow-lg"
          />
          
          {!analysisResult.length && (
            <div className="mt-4 flex gap-2">
              <AnimatedButton
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                className="flex-1"
              >
                ANALISA
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  setImage(null);
                  setError(null);
                }}
                variant="secondary"
              >
                Ganti Gambar
              </AnimatedButton>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-200">{error}</p>
              <p className="text-red-300 text-sm mt-1">
                Silakan upload ulang gambar dengan kualitas lebih baik.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Hasil Analisa:</h3>
            <div className="grid grid-cols-2 gap-3">
              {analysisResult.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/10 rounded-lg flex items-center justify-between"
                >
                  <span className="text-white/80">Produk {item.productIndex}</span>
                  <span className="text-green-400 font-semibold">{item.commission}</span>
                </motion.div>
              ))}
            </div>
            
            <AnimatedButton
              onClick={handleApprove}
              className="w-full mt-4"
              variant="primary"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              APPROVE & LANJUT
            </AnimatedButton>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}