// ========== PHONE MANAGER (app/components/PhoneManager/PhoneList.tsx) ==========
'use client';

import { useState, useEffect } from 'react';
import { Phone, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';

interface PhoneData {
  id?: number;
  name: string;
  whatsapp_number: string;
}

export default function PhoneList() {
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PhoneData>({ name: '', whatsapp_number: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const res = await fetch('/api/phones');
      const data = await res.json();
      setPhones(data);
    } catch (error) {
      toast.error('Gagal memuat data HP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/phones/${editingId}` : '/api/phones';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan');
        fetchPhones();
        resetForm();
      }
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const res = await fetch(`/api/phones/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Data berhasil dihapus');
        fetchPhones();
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', whatsapp_number: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (phone: PhoneData) => {
    setFormData(phone);
    setEditingId(phone.id!);
    setIsAdding(false);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-white/80" />
          <h2 className="text-2xl font-bold text-white">Manage HP/WhatsApp</h2>
        </div>
        
        {!isAdding && !editingId && (
          <AnimatedButton
            onClick={() => setIsAdding(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah HP
          </AnimatedButton>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-white/5 rounded-lg space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama HP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
              <input
                type="text"
                placeholder="Nomor WhatsApp (628...)"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <AnimatedButton type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Simpan
              </AnimatedButton>
              <AnimatedButton
                type="button"
                onClick={resetForm}
                variant="secondary"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Batal
              </AnimatedButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Phone List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-white/50">Loading...</div>
        ) : phones.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            Belum ada data HP. Klik tombol "Tambah HP" untuk menambahkan.
          </div>
        ) : (
          phones.map((phone, index) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-white">{phone.name}</h3>
                <p className="text-white/60 text-sm">{phone.whatsapp_number}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(phone)}
                  className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(phone.id!)}
                  className="p-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  );
});

export default pool;