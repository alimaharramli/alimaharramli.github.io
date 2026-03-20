'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Terminal,
  Shield,
  Database,
  ArrowRight,
  Github,
  Linkedin,
  Activity,
  ExternalLink,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import type { PostMeta, SiteConfig } from '@/types';
import { cn } from '@/lib/utils';

function getIcon(iconName: string) {
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

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-2">
      <span className="text-[10px] text-slate-500 uppercase">{label}</span>
      <span className={cn('text-xs', color)}>{value}</span>
    </div>
  );
}

function ChannelLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group flex items-center justify-between p-5 bg-[#131313] hover:bg-[#201f1f] transition-all duration-300 border border-white/5 active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <span className="text-[#9cff93] group-hover:text-[#00f1fe] transition-colors">
          {icon}
        </span>
        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      </div>
      <ArrowRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function PostCard({
  post,
  onClick,
}: {
  post: PostMeta;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group bg-[#131313] p-8 border border-white/5 hover:border-[#9cff93]/20 transition-all duration-500 relative overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Shield size={64} className="text-[#9cff93]" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#9cff93]"></span>
          <h3 className="font-bold text-lg text-white group-hover:text-[#9cff93] transition-colors uppercase tracking-tighter">
            {post.title}
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          {post.excerpt}
        </p>
        <div className="flex gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Calendar size={12} /> {post.date}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <User size={12} /> {post.author}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock size={12} /> {post.readTime}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalLog() {
  const [logs, setLogs] = useState<string[]>([
    '> INITIALIZING_BOOT_SEQUENCE...',
    '> KERNEL_LOADED_SUCCESSFULLY',
    '> MOUNTING_FILESYSTEM_RO...',
    '> NETWORK_INTERFACE_UP',
    '> STARTING_TERMINAL_DAEMON',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `> [OK] SYNC_DATA_${Math.random().toString(36).substring(7).toUpperCase()}`,
        `> [INFO] HEARTBEAT_DETECTED_${Date.now()}`,
        `> [WARN] LATENCY_SPIKE_${Math.floor(Math.random() * 100)}MS`,
        `> [OK] ENCRYPTION_ROTATED`,
        `> [INFO] LOG_ENTRY_VERIFIED`,
      ];
      setLogs((prev) => [
        ...prev.slice(-10),
        newLogs[Math.floor(Math.random() * newLogs.length)],
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      {logs.map((log, i) => (
        <p
          key={i}
          className={cn(
            'opacity-80',
            log.includes('[OK]') && 'text-[#9cff93]',
            log.includes('[WARN]') && 'text-yellow-500',
            log.includes('[INFO]') && 'text-[#00f1fe]'
          )}
        >
          {log}
        </p>
      ))}
      <p className="animate-pulse text-[#9cff93]">&gt; _</p>
    </div>
  );
}

export function HomePageClient({
  siteConfig,
  posts,
}: {
  siteConfig: SiteConfig;
  posts: PostMeta[];
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
    >
      {/* Left Column: Identity & System Stats */}
      <div className="lg:col-span-4 space-y-12">
        <section className="space-y-6">
          <div className="relative w-32 h-32 group">
            <div className="absolute inset-0 bg-[#9cff93]/20 blur-xl group-hover:bg-[#9cff93]/30 transition-all"></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApZ_21OMotgapx5gPv4UH3r6JPVylm5eZ2KjBvzCHjMEnvYGSkvXICXPTHk5k7JBQuuY1PY2Xm6mqbD0LbI34CxtkmhF6dB-5GJdIaKazx1wgVk2AzkxSCbePk7yK8z968uqTbbeFyP_A_0g_kjschkOEhgo2c96-bTrB8eWXgcTl0mrxKuEyWLuzjq767NPoSShShiYAfomWmBjTA53gnTNPhb-a5I0TEeAEBF_q7MHH2NFzSljST22q15SDw-aVQds-QM4OpQO6z"
              alt="Profile"
              className="w-full h-full object-cover border border-[#9cff93]/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 z-20 bg-[#9cff93] text-[#006413] text-[10px] font-bold px-2 py-0.5 tracking-tighter uppercase">
              ONLINE
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 uppercase">
              @{siteConfig.author}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>
        </section>

        <section
          id="status"
          className="bg-[#131313] p-6 border-l-2 border-[#9cff93]/20 space-y-4 scroll-mt-24"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-[#00f1fe]" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              SYSTEM_STATUS
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(siteConfig.stats).map(([key, value]) => (
              <StatRow
                key={key}
                label={key}
                value={value}
                color={key === 'latency' ? 'text-[#00f1fe]' : 'text-[#9cff93]'}
              />
            ))}
          </div>
        </section>

        <section className="bg-black border border-white/5 p-4 text-[11px] leading-tight text-slate-400">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            <span className="ml-2 text-[9px] uppercase tracking-widest opacity-50">
              CONSOLE_LOG.SH
            </span>
          </div>
          <div className="space-y-1 overflow-hidden font-mono h-32">
            <TerminalLog />
          </div>
        </section>
      </div>

      {/* Right Column: Posts & Projects */}
      <div className="lg:col-span-8 space-y-16">
        <section id="channels" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Verified Channels
            </h2>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteConfig.links.map((link) => (
              <ChannelLink
                key={link.label}
                icon={getIcon(link.icon)}
                label={link.label}
                href={link.url}
              />
            ))}
          </div>
        </section>

        <section id="logs" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Core Logs
            </h2>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => router.push(`/blog/${post.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
