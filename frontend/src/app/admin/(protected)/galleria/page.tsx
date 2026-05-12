'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Trash2, Grid, List, Loader2, ImageIcon } from 'lucide-react';
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
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Galleria</h1>
          <p className="text-white/30 text-sm mt-1">{items.length} file caricati</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-hornets-yellow text-hornets-ink' : 'text-white/30 hover:text-white/60'}`}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-hornets-yellow text-hornets-ink' : 'text-white/30 hover:text-white/60'}`}
            >
              <List size={15} />
            </button>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-hornets-yellow-dark transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Caricamento...' : 'Carica'}
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-white/[0.08] hover:border-hornets-yellow/30 rounded-2xl transition-colors p-8 text-center mb-6 cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-10 h-10 bg-white/[0.04] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-hornets-yellow/10 transition-colors">
          <Upload size={18} className="text-white/25 group-hover:text-hornets-yellow transition-colors" />
        </div>
        <p className="text-white/30 text-sm">Trascina i file qui o clicca per selezionare</p>
        <p className="text-white/15 text-xs mt-1">JPG, PNG, WebP, MP4 · Max 10 MB per file</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-hornets-yellow animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/15">
          <ImageIcon size={40} className="mb-3" />
          <p className="text-sm">Nessun media caricato</p>
        </div>
      ) : (
        <div className={view === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'
          : 'space-y-2'
        }>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025 }}
              className={view === 'grid'
                ? 'relative aspect-square bg-hornets-gray rounded-xl group overflow-hidden'
                : 'flex items-center gap-4 bg-hornets-black-card border border-white/[0.06] rounded-xl p-3'
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
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <span className="text-[10px] font-bold bg-hornets-yellow text-hornets-ink px-1.5 py-0.5 rounded-md uppercase">
                      {item.tipo}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-14 h-10 shrink-0 bg-hornets-gray rounded-lg overflow-hidden">
                    <Image src={item.url} alt={item.titolo || 'Media'} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.titolo || 'Senza titolo'}</p>
                    <p className="text-white/30 text-xs">{item.categoria || '—'} · {item.tipo}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
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
