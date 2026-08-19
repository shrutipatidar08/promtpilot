import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole, Mail, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onAuthenticated: () => void;
}

type AuthView = 'signIn' | 'signUp' | 'verify';

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [view, setView] = useState<AuthView>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCredentials = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateCredentials();
    if (validationError) return setError(validationError);
    setError(''); setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setIsSubmitting(false);
    if (signInError) return setError(signInError.message);
    onAuthenticated();
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateCredentials();
    if (validationError) return setError(validationError);
    setError(''); setIsSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(), password, options: { emailRedirectTo: window.location.origin },
    });
    setIsSubmitting(false);
    if (signUpError) return setError(signUpError.message);
    setMessage(`We sent a six-digit code to ${email.trim()}.`);
    setView('verify');
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError('Enter the six-digit code from your email.');
    setError(''); setIsSubmitting(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp, type: 'signup' });
    setIsSubmitting(false);
    if (verifyError) return setError(verifyError.message);
    onAuthenticated();
  };

  const handleResend = async () => {
    setError(''); setIsSubmitting(true);
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    setIsSubmitting(false);
    if (resendError) return setError(resendError.message);
    setMessage(`A new code was sent to ${email.trim()}.`);
  };

  const isVerify = view === 'verify';
  const isSignUp = view === 'signUp';
  const heading = isVerify ? 'Verify your email' : isSignUp ? 'Create your account' : 'Welcome back';
  const subtitle = isVerify ? 'Enter the six-digit code sent to your inbox to complete registration.' : isSignUp ? 'Create an account to save and access your workspace.' : 'Sign in to continue to your workspace.';

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#E5E1E4] grid lg:grid-cols-2">
      <section className="relative hidden lg:flex overflow-hidden border-r border-white/5 p-12 xl:p-16 flex-col justify-between">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#5E4634]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#3D2B1F]/30 blur-3xl" />
        <Brand />
        <div className="relative max-w-lg"><p className="text-[#DEC1AF] text-sm font-medium tracking-wide mb-5">PROMPTS, MADE PRACTICAL</p><h1 className="text-5xl xl:text-6xl leading-[1.06] font-semibold tracking-tight text-white">Turn rough ideas into clear instructions.</h1><p className="mt-6 text-base leading-relaxed text-[#A69992] max-w-md">Refine your work with structured prompts that are ready for the model you use.</p></div>
        <p className="relative text-xs text-[#6E645F]">Secure authentication powered by Supabase.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12"><Brand /></div>
          <div className="mb-8">{isVerify && <button onClick={() => { setView('signUp'); setError(''); }} className="mb-5 inline-flex items-center gap-1.5 text-xs text-[#DEC1AF] hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Back to sign up</button>}<h2 className="text-3xl font-semibold tracking-tight text-white">{heading}</h2><p className="mt-2 text-sm text-[#9B8E87]">{subtitle}</p></div>
          {isVerify ? (
            <form onSubmit={handleVerify} className="space-y-5" noValidate>
              <label className="block space-y-2"><span className="text-sm font-medium text-[#D2C4BC]">Verification code</span><div className="relative"><KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E87]" /><input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-[#18181A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm tracking-[0.35em] text-white placeholder:text-[#6E645F] focus:border-[#DEC1AF] focus:outline-none" /></div></label>
              {message && <p className="text-sm text-emerald-400">{message}</p>}{error && <p className="text-sm text-rose-400">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#3D2B1F] hover:bg-[#5E4634] disabled:opacity-50 text-[#DEC1AF] border border-[#5E4634] rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">{isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Verify and continue <ArrowRight className="w-4 h-4" /></>}</button>
              <button type="button" disabled={isSubmitting} onClick={handleResend} className="w-full text-sm text-[#DEC1AF] hover:text-white disabled:opacity-50">Resend code</button>
            </form>
          ) : (
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5" noValidate>
              <label className="block space-y-2"><span className="text-sm font-medium text-[#D2C4BC]">Email address</span><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E87]" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="w-full bg-[#18181A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#6E645F] focus:border-[#DEC1AF] focus:outline-none" /></div></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-[#D2C4BC]">Password</span><div className="relative"><LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E87]" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={isSignUp ? 'new-password' : 'current-password'} className="w-full bg-[#18181A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#6E645F] focus:border-[#DEC1AF] focus:outline-none" /></div></label>
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#3D2B1F] hover:bg-[#5E4634] disabled:opacity-50 text-[#DEC1AF] border border-[#5E4634] rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">{isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>{isSignUp ? 'Create account' : 'Sign in to PromptPilot'} <ArrowRight className="w-4 h-4" /></>}</button>
            </form>
          )}
          {!isVerify && <p className="mt-7 text-center text-sm text-[#9B8E87]">{isSignUp ? 'Already registered?' : 'New to PromptPilot?'} <button onClick={() => { setView(isSignUp ? 'signIn' : 'signUp'); setError(''); }} className="text-[#DEC1AF] hover:text-white font-medium">{isSignUp ? 'Sign in' : 'Create an account'}</button></p>}
        </div>
      </section>
    </main>
  );
};

const Brand = () => <div className="relative flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#201F21] border border-[#5E4634] flex items-center justify-center text-[#DEC1AF]"><Sparkles className="w-5 h-5" /></div><div><p className="font-bold text-xl tracking-tight text-white italic font-serif">PromptPilot</p><p className="text-[11px] text-[#A69992] tracking-wide">INTELLIGENCE ORCHESTRATOR</p></div></div>;
