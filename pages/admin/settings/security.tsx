import { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextImage from 'next/image';
import { CheckCircle2, CircleAlert, KeyRound, LogOut, QrCode, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface TotpFactor {
  id: string;
  friendly_name?: string;
  status?: string;
  created_at?: string;
}

interface Enrollment {
  id: string;
  qrCode: string;
  secret: string;
}

export default function SecuritySettings() {
  const { session, loading: authLoading } = useAuth();
  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadFactors = useCallback(async () => {
    if (authLoading) return;
    if (!session || !supabase) {
      setError('Your admin session is unavailable. Please sign in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) setError(factorsError.message);
    else setFactors((data?.totp || []) as TotpFactor[]);
    setLoading(false);
  }, [authLoading, session]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFactors(), 0);
    return () => window.clearTimeout(timer);
  }, [loadFactors]);

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) return setError('Authentication is not configured.');
    if (newPassword !== confirmPassword) return setError('The passwords do not match.');
    if (newPassword.length < 12 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return setError('Use at least 12 characters with uppercase, lowercase, and a number.');
    }
    setSaving(true);
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (passwordError) return setError(passwordError.message);
    setNewPassword('');
    setConfirmPassword('');
    setNotice('Password updated successfully.');
  };

  const beginEnrollment = async () => {
    if (!supabase) return;
    setError('');
    setNotice('');
    setSaving(true);
    const { data, error: enrollmentError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Saintlammy Foundation Admin'
    });
    setSaving(false);
    if (enrollmentError) return setError(enrollmentError.message);
    setEnrollment({ id: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  };

  const verifyEnrollment = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !enrollment) return;
    setSaving(true);
    setError('');
    const { error: verificationError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollment.id,
      code: verificationCode.replace(/\s/g, '')
    });
    setSaving(false);
    if (verificationError) return setError(verificationError.message);
    setEnrollment(null);
    setVerificationCode('');
    setNotice('Two-factor authentication is now enabled.');
    await loadFactors();
  };

  const removeFactor = async (factor: TotpFactor) => {
    if (!supabase || !window.confirm('Disable two-factor authentication for this account?')) return;
    setError('');
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
    if (unenrollError) return setError(unenrollError.message);
    setNotice('Two-factor authentication disabled.');
    await loadFactors();
  };

  const signOutOtherSessions = async () => {
    if (!supabase || !window.confirm('Sign out all other sessions for this account?')) return;
    setError('');
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'others' });
    if (signOutError) return setError(signOutError.message);
    setNotice('Other sessions have been signed out.');
  };

  return (
    <>
      <Head><title>Account Security | Saintlammy Foundation Admin</title></Head>
      <AdminLayout title="Account Security">
        <div className="mx-auto max-w-5xl space-y-6">
          <header><p className="text-sm font-medium uppercase tracking-[0.16em] text-accent-300">Signed-in administrator</p><h2 className="mt-2 text-3xl font-semibold text-white">Protect your account</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">Password and two-factor changes are applied directly through Supabase Auth. The dashboard does not fabricate session or security-event records.</p></header>
          {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100"><CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />{error}</div>}
          {notice && <div role="status" className="flex gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-sm text-emerald-100"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />{notice}</div>}

          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={changePassword} className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6">
              <KeyRound className="h-6 w-6 text-accent-300" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">Change password</h3><p className="mt-1 text-sm text-gray-400">Use a unique password with at least 12 characters.</p>
              <div className="mt-5 space-y-4"><div><label htmlFor="new-password" className="mb-2 block text-sm font-medium text-gray-200">New password</label><input id="new-password" type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 text-white" /></div><div><label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-200">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-4 text-white" /></div></div>
              <button type="submit" disabled={saving || loading} className="mt-5 min-h-11 rounded-lg bg-accent-500 px-5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50">{saving ? 'Updating…' : 'Update password'}</button>
            </form>

            <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6" aria-labelledby="two-factor-title">
              <ShieldCheck className="h-6 w-6 text-accent-300" aria-hidden="true" /><h3 id="two-factor-title" className="mt-4 text-lg font-semibold text-white">Two-factor authentication</h3><p className="mt-1 text-sm text-gray-400">Add a time-based code from an authenticator app.</p>
              {loading ? <p className="mt-5 text-sm text-gray-300">Checking factors…</p> : factors.length ? <div className="mt-5 space-y-3">{factors.map((factor) => <div key={factor.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4"><div><p className="text-sm font-medium text-white">{factor.friendly_name || 'Authenticator app'}</p><p className="mt-1 text-xs capitalize text-emerald-300">{factor.status || 'verified'}</p></div><button type="button" onClick={() => void removeFactor(factor)} className="min-h-11 rounded-lg border border-red-500/40 px-3 text-sm text-red-200 hover:bg-red-950/40">Disable</button></div>)}</div> : <button type="button" onClick={() => void beginEnrollment()} disabled={saving} className="mt-5 min-h-11 rounded-lg border border-gray-600 px-4 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"><QrCode className="mr-2 inline h-4 w-4" aria-hidden="true" />Set up authenticator</button>}
            </section>
          </div>

          {enrollment && <form onSubmit={verifyEnrollment} className="rounded-xl border border-accent-500/40 bg-gray-800 p-5 sm:p-6"><h3 className="text-lg font-semibold text-white">Scan and verify</h3><p className="mt-2 text-sm text-gray-300">Scan this code in your authenticator app, then enter its six-digit code.</p><div className="mt-5 grid gap-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center"><NextImage unoptimized width={192} height={192} src={enrollment.qrCode} alt="Authenticator enrollment QR code" className="h-48 w-48 rounded-lg bg-white p-2" /><div><p className="break-all font-mono text-xs text-gray-400">Manual key: {enrollment.secret}</p><label htmlFor="verification-code" className="mb-2 mt-4 block text-sm font-medium text-gray-200">Verification code</label><input id="verification-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="min-h-11 w-full max-w-xs rounded-lg border border-gray-600 bg-gray-900 px-4 text-white" /><button type="submit" disabled={saving} className="mt-3 block min-h-11 rounded-lg bg-accent-500 px-5 text-sm font-semibold text-white disabled:opacity-50">Verify and enable</button></div></div></form>}

          <section className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6" aria-labelledby="sessions-title"><LogOut className="h-6 w-6 text-accent-300" aria-hidden="true" /><h3 id="sessions-title" className="mt-4 text-lg font-semibold text-white">Sessions and security history</h3><p className="mt-2 text-sm leading-6 text-gray-300">Current account: {session?.user.email || 'Unavailable'}. Supabase does not expose a browser-safe inventory of individual sessions or Auth audit-log history here. You can securely revoke every other session now.</p><button type="button" onClick={() => void signOutOtherSessions()} className="mt-5 min-h-11 rounded-lg border border-gray-600 px-4 text-sm font-medium text-white hover:bg-gray-700">Sign out other sessions</button></section>
        </div>
      </AdminLayout>
    </>
  );
}
