// ========== PIE CHART COMPONENT (app/components/Navbar3/PieChart.tsx) ==========
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface PieChartProgressProps {
  collected: number;
  threshold: number;
}

export default function PieChartProgress({ collected, threshold }: PieChartProgressProps) {
  const remaining = Math.max(0, threshold - collected);
  const data = [
    { name: 'Terkumpul', value: collected, color: '#60A5FA' },
    { name: 'Sisa', value: remaining, color: '#374151' }
  ];

  const percentage = Math.min(100, (collected / threshold) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: 'none',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</span>
        <span className="text-white/60 text-sm">{collected} / {threshold}</span>
      </div>
    </motion.div>
  );
}