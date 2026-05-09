'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-hornets-yellow/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-hornets-yellow/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-hornets-yellow flex items-center justify-center font-display text-hornets-black text-3xl font-black mx-auto mb-4">
            H
          </div>
          <h1 className="font-display text-2xl text-hornets-white uppercase tracking-wider">
            Hornets Taekwondo
          </h1>
          <p className="text-white/30 text-sm mt-1 uppercase tracking-widest">Backoffice Admin</p>
        </div>

        {/* Card */}
        <div className="bg-hornets-black-card border border-white/5 p-8">
          <h2 className="text-hornets-white font-semibold text-lg mb-6">Accesso Amministratore</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input-dark pl-10"
                  placeholder="admin@hornets-taekwondo.it"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-dark pl-10 pr-10"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Accesso in corso...' : 'Accedi al Backoffice'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Area riservata. Accesso non autorizzato vietato.
        </p>
      </div>
    </div>
  );
}
