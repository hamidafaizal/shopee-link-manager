'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Upload, Send, Phone } from 'lucide-react';
import UploadCSV from './components/Navbar1/UploadCSV';
import FilterResults from './components/Navbar1/FilterResults';
import UploadScreenshot from './components/Navbar2/UploadScreenshot';
import ThresholdInput from './components/Navbar3/ThresholdInput';
import PieChartProgress from './components/Navbar3/PieChart';
import BatchList from './components/Navbar3/BatchList';
import PhoneList from './components/PhoneManager/PhoneList';
import GlassCard from './components/UI/GlassCard';
import { cn } from '@/lib/utils';

type TabType = 'upload' | 'komreg' | 'distribute' | 'phones';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [collectedLinks, setCollectedLinks] = useState<string[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [phones, setPhones] = useState<any[]>([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const res = await fetch('/api/phones');
      const data = await res.json();
      setPhones(data);
    } catch (error) {
      console.error('Failed to fetch phones:', error);
    }
  };

  const handleDataProcessed = (data: any[]) => {
    setFilteredData(data);
  };

  const handleReset = () => {
    setFilteredData([]);
    setCurrentBatch(1);
    setCurrentScreenshotIndex(0);
  };

  const handleSendToNavbar3 = () => {
    if (!threshold) {
      alert('Silakan set threshold terlebih dahulu di tab Distribusi');
      setActiveTab('distribute');
      return;
    }

    const links = filteredData.map(item => item.productLink);
    const limitedLinks = links.slice(0, threshold);
    setCollectedLinks(prev => [...prev, ...limitedLinks]);
    
    // Create batches
    const newBatches = [];
    for (let i = 0; i < limitedLinks.length; i += 100) {
      newBatches.push({
        id: Date.now() + i,
        links: limitedLinks.slice(i, i + 100),
        isFull: limitedLinks.slice(i, i + 100).length === 100
      });
    }
    setBatches(prev => [...prev, ...newBatches]);
    
    // Reset Navbar 1 & 2
    handleReset();
    setActiveTab('distribute');
  };

  const handleAnalyzeImage = async (imageBase64: string) => {
    // Simulate API call to Gemini
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    });
    
    return await response.json();
  };

  const handleApproveCommission = (commissions: any[]) => {
    // Update commission data in filteredData
    const startIndex = currentScreenshotIndex * 4;
    commissions.forEach((comm, index) => {
      if (filteredData[startIndex + index]) {
        filteredData[startIndex + index].commission = comm.commission;
      }
    });
    
    setFilteredData([...filteredData]);
    setCurrentScreenshotIndex(prev => prev + 1);
    
    // Check if all commissions are filled
    if ((currentScreenshotIndex + 1) * 4 >= filteredData.length) {
      setCurrentScreenshotIndex(0);
      setCurrentBatch(prev => prev + 1);
    }
  };

  const handleDistribute = async (batchId: number, phoneId: number) => {
    const batch = batches.find(b => b.id === batchId);
    const phone = phones.find(p => p.id === phoneId);
    
    if (!batch || !phone) return;
    
    // Create WhatsApp message
    const message = batch.links.join('\n');
    const whatsappUrl = `https://wa.me/${phone.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp Web
    window.open(whatsappUrl, '_blank');
    
    // Remove batch from list
    setBatches(batches.filter(b => b.id !== batchId));
    
    // Log distribution
    await fetch('/api/distribute-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batchId,
        phoneId,
        linksCount: batch.links.length
      })
    });
  };

  const tabs = [
    { id: 'upload', label: 'Upload CSV', icon: Upload },
    { id: 'komreg', label: 'Komreg', icon: BarChart3 },
    { id: 'distribute', label: 'Distribusi', icon: Send },
    { id: 'phones', label: 'Manage HP', icon: Phone },
  ];

  const totalBatches = Math.ceil(filteredData.length / 100);

  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white text-center mb-8"
      >
        Shopee Link Manager
      </motion.h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <GlassCard className="p-1 inline-flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </GlassCard>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <UploadCSV onDataProcessed={handleDataProcessed} />
            {filteredData.length > 0 && (
              <FilterResults
                data={filteredData}
                onReset={handleReset}
                onSendToNavbar3={handleSendToNavbar3}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'komreg' && (
          <motion.div
            key="komreg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {filteredData.length > 0 ? (
              <UploadScreenshot
                currentBatch={currentBatch}
                totalBatches={totalBatches}
                onAnalyze={handleAnalyzeImage}
                onApprove={handleApproveCommission}
              />
            ) : (
              <GlassCard className="p-8 text-center">
                <p className="text-white/60">
                  Silakan upload dan proses CSV terlebih dahulu di tab Upload CSV
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 'distribute' && (
          <motion.div
            key="distribute"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              {!threshold ? (
                <ThresholdInput onThresholdSet={setThreshold} />
              ) : (
                <>
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Threshold: {threshold} links
                    </h3>
                    <PieChartProgress
                      collected={collectedLinks.length}
                      threshold={threshold}
                    />
                  </GlassCard>
                  
                  <GlassCard className="p-4">
                    <button
                      onClick={() => setThreshold(null)}
                      className="text-white/60 hover:text-white text-sm"
                    >
                      Ubah Threshold
                    </button>
                  </GlassCard>
                </>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Batch Links</h3>
              <BatchList
                batches={batches}
                phones={phones}
                onDistribute={handleDistribute}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'phones' && (
          <motion.div
            key="phones"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <PhoneList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}