'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth.store';

const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'Password obbligatoria'),
});
type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/admin/dashboard');
    } catch {
      setError('Credenziali non valide. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hornets-black flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-hornets-yellow/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-hornets-yellow/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-hornets-yellow rounded-2xl flex items-center justify-center font-display text-hornets-ink text-3xl font-black mx-auto mb-5 shadow-yellow">
            H
          </div>
          <h1 className="font-display font-bold text-white text-2xl mb-1">
            Hornets Taekwondo
          </h1>
          <p className="text-white/30 text-xs uppercase tracking-widest">Area amministrativa</p>
        </div>

        {/* Card */}
        <div className="bg-hornets-black-card border border-white/[0.08] rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-6">Accedi al backoffice</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input-dark pl-10"
                  placeholder="admin@hornets-taekwondo.it"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-dark pl-10 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-hornets-yellow text-hornets-ink font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-hornets-yellow-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-hornets-ink/40 border-t-hornets-ink rounded-full animate-spin" />
              ) : (
                <>Accedi <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          Area riservata — accesso non autorizzato vietato
        </p>
      </div>
    </div>
  );
}
