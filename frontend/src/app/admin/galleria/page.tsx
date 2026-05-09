'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Trash2, Grid, List, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api.client';

interface MediaItem {
  id: string;
  titolo: string | null;
  tipo: 'foto' | 'video';
  url: string;
  thumbnailUrl: string | null;
  categoria: string | null;
}

export default function AdminGalleriaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = () => {
    apiClient.get('/galleria?limit=50')
      .then(({ data }) => setItems(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    formData.append('categoria', 'generale');

    try {
      await apiClient.post('/galleria/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo media definitivamente?')) return;
    try {
      await apiClient.delete(`/galleria/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-hornets-white uppercase">Galleria</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} media caricati</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex border border-white/10">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-hornets-yellow text-hornets-black' : 'text-white/40 hover:text-white/70'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-hornets-yellow text-hornets-black' : 'text-white/40 hover:text-white/70'}`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-xs px-6 py-3 flex items-center gap-2"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Caricamento...' : 'Carica Media'}
          </button>
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        className="border-2 border-dashed border-white/10 hover:border-hornets-yellow/30 transition-colors p-8 text-center mb-8 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-white/30 text-sm">Trascina file qui o clicca per selezionare</p>
        <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP, MP4 — Max 10MB per file</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-hornets-yellow animate-spin" />
        </div>
      ) : (
        <div className={view === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3'
          : 'space-y-2'
        }>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={view === 'grid'
                ? 'relative aspect-square bg-hornets-gray group overflow-hidden'
                : 'flex items-center gap-4 bg-hornets-black-card border border-white/5 p-3'
              }
            >
              {view === 'grid' ? (
                <>
                  <Image
                    src={item.url}
                    alt={item.titolo || 'Media'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute top-1 left-1">
                    <span className="bg-hornets-yellow text-hornets-black text-[10px] font-bold px-1.5 py-0.5 uppercase">
                      {item.tipo}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-16 h-12 shrink-0 bg-hornets-gray overflow-hidden">
                    <Image src={item.url} alt={item.titolo || 'Media'} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-hornets-white text-sm font-medium truncate">{item.titolo || 'Senza titolo'}</p>
                    <p className="text-white/30 text-xs">{item.categoria || '—'} · {item.tipo}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
