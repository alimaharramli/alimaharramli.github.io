'use client';

import {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Database,
  Settings,
  Github,
  Linkedin,
  Activity,
  ExternalLink,
} from 'lucide-react';
import type { SiteConfig } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Toast context — lets any child component trigger the shared toast notification
// ---------------------------------------------------------------------------
export const ToastContext = createContext<
  (message: string, type?: 'success' | 'info') => void
>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

// ---------------------------------------------------------------------------
// Icon helper (exported so HomePage can reuse it)
// ---------------------------------------------------------------------------
export function getIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case 'github':
      return <Github size={20} />;
    case 'linkedin':
      return <Linkedin size={20} />;
    case 'terminal':
      return <Terminal size={20} />;
    case 'database':
      return <Database size={20} />;
    default:
      return <ExternalLink size={20} />;
  }
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex justify-between items-center group cursor-pointer"
      onClick={onClick}
    >
      <span className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">
        {label}
      </span>
      <div
        className={cn(
          'w-8 h-4 border transition-all relative',
          active
            ? 'bg-[#9cff93]/20 border-[#9cff93]'
            : 'bg-black border-white/20'
        )}
      >
        <motion.div
          animate={{ x: active ? 16 : 0 }}
          className={cn(
            'absolute top-0.5 left-0.5 w-2.5 h-2.5',
            active ? 'bg-[#9cff93]' : 'bg-white/20'
          )}
        />
      </div>
    </div>
  );
}

export function LayoutShell({
  siteConfig,
  children,
}: {
  siteConfig: SiteConfig;
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [crtEffect, setCrtEffect] = useState(false);
  const [scanlines, setScanlines] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const scrollToSection = (id: string) => {
    if (!isHome) {
      router.push('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      <div
        className={cn(
          'min-h-screen bg-[#0e0e0e] text-[#ffffff] font-mono selection:bg-[#9cff93] selection:text-[#006413] relative overflow-x-hidden',
          crtEffect && 'animate-crt-flicker',
          scanlines &&
            "after:content-[''] after:fixed after:inset-0 after:pointer-events-none after:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] after:bg-[length:100%_4px,3px_100%] after:z-[100]"
        )}
      >
        {/* Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#9cff93 1px, transparent 1px), linear-gradient(90deg, #9cff93 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-12 left-1/2 z-[200] bg-[#131313] border border-[#9cff93] px-6 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(156,255,147,0.2)]"
            >
              <div className="w-2 h-2 bg-[#9cff93] animate-pulse"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#9cff93] uppercase">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-[#9cff93]/15">
          <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="w-8 h-8 bg-[#9cff93]/10 flex items-center justify-center border border-[#9cff93]/30 group-hover:bg-[#9cff93]/20 transition-all">
                <Terminal size={18} className="text-[#9cff93]" />
              </div>
              <span className="font-bold tracking-tighter text-[#9cff93] uppercase text-xl">
                {siteConfig.title}
              </span>
            </div>

            <nav className="hidden md:flex gap-8 items-center">
              <button
                onClick={() => router.push('/')}
                className={cn(
                  'text-xs tracking-widest uppercase transition-colors duration-300',
                  isHome
                    ? 'text-[#9cff93] font-bold'
                    : 'text-slate-400 hover:text-[#00f1fe]'
                )}
              >
                ROOT
              </button>
              <button
                onClick={() => scrollToSection('channels')}
                className="text-slate-400 font-label uppercase text-xs tracking-widest hover:text-[#00f1fe] transition-colors duration-300"
              >
                LINKS
              </button>
              <button
                onClick={() => scrollToSection('logs')}
                className="text-slate-400 font-label uppercase text-xs tracking-widest hover:text-[#00f1fe] transition-colors duration-300"
              >
                LOGS
              </button>
              <button
                onClick={() => scrollToSection('status')}
                className="text-slate-400 font-label uppercase text-xs tracking-widest hover:text-[#00f1fe] transition-colors duration-300"
              >
                STATUS
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  'p-2 transition-colors',
                  showSettings
                    ? 'text-[#00f1fe] bg-[#00f1fe]/10'
                    : 'text-[#9cff93] hover:bg-[#9cff93]/10'
                )}
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowActivity(!showActivity)}
                className={cn(
                  'p-2 transition-colors',
                  showActivity
                    ? 'text-[#00f1fe] bg-[#00f1fe]/10'
                    : 'text-[#9cff93] hover:bg-[#9cff93]/10'
                )}
              >
                <Activity size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 right-6 z-[60] w-64 bg-[#131313] border border-[#9cff93]/30 p-6 shadow-2xl"
            >
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#9cff93] uppercase mb-6 border-b border-[#9cff93]/10 pb-2">
                SYSTEM_CONFIG
              </h3>
              <div className="space-y-4">
                <Toggle
                  label="CRT_FLICKER"
                  active={crtEffect}
                  onClick={() => setCrtEffect(!crtEffect)}
                />
                <Toggle
                  label="SCANLINES"
                  active={scanlines}
                  onClick={() => setScanlines(!scanlines)}
                />
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full py-2 bg-[#9cff93]/10 text-[#9cff93] text-[10px] font-bold uppercase tracking-widest hover:bg-[#9cff93]/20 transition-all"
                  >
                    REBOOT_SYSTEM
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Panel */}
        <AnimatePresence>
          {showActivity && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 right-6 z-[60] w-80 bg-[#131313] border border-[#00f1fe]/30 p-6 shadow-2xl"
            >
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#00f1fe] uppercase mb-6 border-b border-[#00f1fe]/10 pb-2">
                NETWORK_ACTIVITY
              </h3>
              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>INCOMING_TRAFFIC</span>
                  <span className="text-[#9cff93]">12.4 KB/S</span>
                </div>
                <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 w-1/3 bg-[#00f1fe]"
                  />
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>OUTGOING_TRAFFIC</span>
                  <span className="text-[#00f1fe]">2.1 KB/S</span>
                </div>
                <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                  <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 w-1/4 bg-[#9cff93]"
                  />
                </div>
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <p className="text-[#9cff93] opacity-50 tracking-tighter">
                    [OK] HANDSHAKE_ESTABLISHED
                  </p>
                  <p className="text-[#00f1fe] opacity-50 tracking-tighter">
                    [OK] ENCRYPTION_ACTIVE
                  </p>
                  <p className="text-red-500 opacity-50 tracking-tighter">
                    [WARN] UNAUTHORIZED_ACCESS_ATTEMPT
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">{children}</main>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-[#9cff93]/10 bg-[#0e0e0e]">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-4 max-w-7xl mx-auto">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#9cff93]">
              © 2026 TERMINAL_OS // ALL RIGHTS RESERVED
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                SYSTEM_STATUS: <span className="text-[#9cff93]">ONLINE</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                ENCRYPTED_CONNECTION
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                v4.0.2
              </span>
            </div>
          </div>
        </footer>
      </div>
    </ToastContext.Provider>
  );
}
