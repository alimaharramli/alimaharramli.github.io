import { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Outlet, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import fm from 'front-matter';
import {
  Terminal,
  Shield,
  Database,
  ArrowRight,
  ArrowLeft,
  Share2,
  Download,
  Settings,
  User,
  Clock,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Activity,
  Copy,
  Twitter,
} from 'lucide-react';
import { Post, PostMeta } from './types';
import { cn } from './lib/utils';

// ---------------------------------------------------------------------------
// Lazy glob — each post file becomes its own dynamic chunk.
// Nothing is bundled into the main JS until the user actually visits a route.
// ---------------------------------------------------------------------------
const postLoaders = import.meta.glob('./content/posts/*.md', { query: '?raw' });
const configFile = import.meta.glob('./content/config.md', { query: '?raw', eager: true });

interface SiteConfig {
  title: string;
  author: string;
  description: string;
  stats: Record<string, string>;
  links: Array<{ label: string; url: string; icon: string }>;
}

// ---------------------------------------------------------------------------
// Toast context — lets any child page trigger the shared toast notification
// ---------------------------------------------------------------------------
const ToastContext = createContext<(message: string, type?: 'success' | 'info') => void>(() => {
  if (import.meta.env.DEV) {
    console.warn('useToast() was called outside of ToastContext.Provider');
  }
});
function useToast() { return useContext(ToastContext); }

// ---------------------------------------------------------------------------
// Root App — parses static config and wires up routes
// ---------------------------------------------------------------------------
export default function App() {
  const siteConfig = useMemo(() => {
    const raw = Object.values(configFile)[0] as any;
    if (!raw) return null;
    const { attributes } = fm(raw.default) as { attributes: SiteConfig };
    return attributes;
  }, []);

  if (!siteConfig) return null;

  return (
    <Routes>
      <Route path="/" element={<Layout siteConfig={siteConfig} />}>
        <Route index element={<HomePage />} />
        <Route path="blog/:id" element={<PostPage />} />
      </Route>
    </Routes>
  );
}

// ---------------------------------------------------------------------------
// Layout — shared header, footer, settings panel, toast notification
// ---------------------------------------------------------------------------
function Layout({ siteConfig }: { siteConfig: SiteConfig }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [crtEffect, setCrtEffect] = useState(true);
  const [scanlines, setScanlines] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github': return <Github size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'terminal': return <Terminal size={20} />;
      case 'database': return <Database size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      <div className={cn(
        "min-h-screen bg-[#0e0e0e] text-[#ffffff] font-mono selection:bg-[#9cff93] selection:text-[#006413] relative overflow-x-hidden",
        crtEffect && "animate-crt-flicker",
        scanlines && "after:content-[''] after:fixed after:inset-0 after:pointer-events-none after:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] after:bg-[length:100%_4px,3px_100%] after:z-[100]"
      )}>
        {/* Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#9cff93 1px, transparent 1px), linear-gradient(90deg, #9cff93 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
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
              onClick={() => navigate('/')}
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
                onClick={() => navigate('/')}
                className={cn(
                  "text-xs tracking-widest uppercase transition-colors duration-300",
                  isHome ? "text-[#9cff93] font-bold" : "text-slate-400 hover:text-[#00f1fe]"
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
                className={cn("p-2 transition-colors", showSettings ? "text-[#00f1fe] bg-[#00f1fe]/10" : "text-[#9cff93] hover:bg-[#9cff93]/10")}
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowActivity(!showActivity)}
                className={cn("p-2 transition-colors", showActivity ? "text-[#00f1fe] bg-[#00f1fe]/10" : "text-[#9cff93] hover:bg-[#9cff93]/10")}
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
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#9cff93] uppercase mb-6 border-b border-[#9cff93]/10 pb-2">SYSTEM_CONFIG</h3>
              <div className="space-y-4">
                <Toggle label="CRT_FLICKER" active={crtEffect} onClick={() => setCrtEffect(!crtEffect)} />
                <Toggle label="SCANLINES" active={scanlines} onClick={() => setScanlines(!scanlines)} />
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
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#00f1fe] uppercase mb-6 border-b border-[#00f1fe]/10 pb-2">NETWORK_ACTIVITY</h3>
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
                  <p className="text-[#9cff93] opacity-50 tracking-tighter">[OK] HANDSHAKE_ESTABLISHED</p>
                  <p className="text-[#00f1fe] opacity-50 tracking-tighter">[OK] ENCRYPTION_ACTIVE</p>
                  <p className="text-red-500 opacity-50 tracking-tighter">[WARN] UNAUTHORIZED_ACCESS_ATTEMPT</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
          <Outlet context={{ siteConfig, getIcon }} />
        </main>

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
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">ENCRYPTED_CONNECTION</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">v4.0.2</span>
            </div>
          </div>
        </footer>
      </div>
    </ToastContext.Provider>
  );
}

type LayoutContext = {
  siteConfig: SiteConfig;
  getIcon: (name: string) => React.ReactNode;
};

// ---------------------------------------------------------------------------
// HomePage — lazily loads post metadata for the listing (no full content)
// ---------------------------------------------------------------------------
function HomePage() {
  const { siteConfig, getIcon } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostMeta[]>([]);

  useEffect(() => {
    // Load all post files lazily — each is its own dynamic chunk.
    // We only parse the front-matter attributes here; the body is discarded.
    Promise.all(
      Object.values(postLoaders).map(async (loader) => {
        const mod = await loader() as { default: string };
        const { attributes } = fm(mod.default) as { attributes: PostMeta };
        return attributes;
      })
    ).then((metas) => {
      setPosts(metas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
  }, []);

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
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 uppercase">@{siteConfig.author}</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>
        </section>

        <section id="status" className="bg-[#131313] p-6 border-l-2 border-[#9cff93]/20 space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-[#00f1fe]" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">SYSTEM_STATUS</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(siteConfig.stats).map(([key, value]) => (
              <StatRow key={key} label={key} value={value} color={key === 'latency' ? 'text-[#00f1fe]' : 'text-[#9cff93]'} />
            ))}
          </div>
        </section>

        <section className="bg-black border border-white/5 p-4 text-[11px] leading-tight text-slate-400">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            <span className="ml-2 text-[9px] uppercase tracking-widest opacity-50">CONSOLE_LOG.SH</span>
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
            <h2 className="text-2xl font-bold tracking-tight uppercase">Verified Channels</h2>
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
            <h2 className="text-2xl font-bold tracking-tight uppercase">Core Logs</h2>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/blog/${post.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// PostPage — lazily loads ONLY the specific post file identified by the URL
// ---------------------------------------------------------------------------
function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Direct lookup by filename — each post file is named after its id.
    const loader = postLoaders[`./content/posts/${id}.md`];
    if (!loader) {
      setNotFound(true);
      return;
    }
    setPost(null);
    setNotFound(false);
    loader().then((mod: any) => {
      const { attributes, body } = fm(mod.default) as { attributes: PostMeta; body: string };
      setPost({ ...attributes, content: body });
    });
  }, [id]);

  const handleShare = useCallback(() => {
    if (!post) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => {
        navigator.clipboard.writeText(url);
        showToast("URL_COPIED_TO_CLIPBOARD");
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast("URL_COPIED_TO_CLIPBOARD");
    }
  }, [post, showToast]);

  const handleSocialShare = (platform: 'twitter' | 'linkedin') => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`[LOG_ENTRY] ${post.title}\n\n${post.excerpt}\n\n`);
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${text}&url=${url}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleDownload = () => {
    if (!post) return;
    const element = document.createElement("a");
    const file = new Blob([post.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.id}.md`;
    document.body.appendChild(element);
    element.click();
    showToast("DATA_STREAM_DOWNLOADED");
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <span className="text-[#9cff93] text-6xl font-black">404</span>
        <p className="text-slate-400 text-sm uppercase tracking-widest">LOG_NOT_FOUND</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#9cff93] font-bold uppercase tracking-tighter"
        >
          <ArrowLeft size={16} /> BACK_TO_TERMINAL
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-[#9cff93] animate-pulse text-xs uppercase tracking-widest">LOADING_DATA_STREAM...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col md:flex-row gap-12"
    >
      {/* Sidebar Metadata */}
      <aside className="w-full md:w-1/4 order-2 md:order-1 space-y-12">
        <section className="space-y-6">
          <MetaItem label="TIMESTAMP" value={post.date} />
          <MetaItem label="READ_TIME" value={post.readTime} />
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-[#262626] text-[0.65rem] text-[#00f1fe] font-bold border border-[#00f1fe]/20 uppercase tracking-wider">
                [{tag}]
              </span>
            ))}
          </div>
        </section>

        <section className="p-6 bg-[#131313] border border-[#9cff93]/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#9cff93]/20 flex items-center justify-center">
              <User size={20} className="text-[#9cff93]" />
            </div>
            <div>
              <p className="text-[0.65rem] text-[#9cff93]/60 font-bold tracking-[0.2em] uppercase">AUTHOR</p>
              <p className="text-sm font-bold text-white">{post.author}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            System architect and security researcher. Specializing in kernel-level exploitation and automated fuzzing techniques.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">SHARE_STREAM</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center justify-center gap-2 p-3 bg-[#131313] border border-white/5 hover:border-[#00f1fe]/30 transition-all text-xs uppercase font-bold"
            >
              <Twitter size={14} className="text-[#00f1fe]" /> X
            </button>
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="flex items-center justify-center gap-2 p-3 bg-[#131313] border border-white/5 hover:border-[#00f1fe]/30 transition-all text-xs uppercase font-bold"
            >
              <Linkedin size={14} className="text-[#00f1fe]" /> IN
            </button>
          </div>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[#131313] border border-white/5 hover:border-[#9cff93]/30 transition-all text-xs uppercase font-bold"
          >
            <Copy size={14} className="text-[#9cff93]" /> COPY_LINK
          </button>
        </section>
      </aside>

      {/* Article Content */}
      <article className="w-full md:w-3/4 order-1 md:order-2 space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center px-2 py-0.5 bg-[#9cff93]/10 text-[#9cff93] text-[0.65rem] font-bold tracking-[0.3em] uppercase mb-4 animate-pulse">
            • SYSTEM_ACTIVE
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-white">
            <span className="text-[#9cff93] mr-4">&gt;</span>{post.title}
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl border-l-2 border-[#00f1fe]/30 pl-6 py-2">
            {post.excerpt}
          </p>
        </header>

        {post.image && (
          <figure className="w-full relative group">
            <div className="absolute -inset-1 bg-[#9cff93]/5 blur group-hover:bg-[#9cff93]/10 transition-all"></div>
            <div className="relative aspect-video bg-[#131313] overflow-hidden border border-[#9cff93]/20">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </figure>
        )}

        <section className="prose prose-invert prose-green max-w-none">
          <div className="text-on-surface/90 leading-relaxed text-lg markdown-body">
            <Markdown>{post.content}</Markdown>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 text-[#9cff93] font-bold tracking-tighter uppercase transition-all"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
            BACK_TO_TERMINAL
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="px-6 py-2 border border-[#00f1fe] text-[#00f1fe] hover:bg-[#00f1fe]/10 transition-all flex items-center gap-2 uppercase text-xs font-bold"
            >
              <Share2 size={16} /> SHARE_LOG
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-[#9cff93] text-[#006413] hover:shadow-[0_0_15px_rgba(156,255,147,0.5)] transition-all uppercase text-xs font-bold flex items-center gap-2"
            >
              <Download size={16} /> DOWNLOAD_DATA
            </button>
          </div>
        </footer>
      </article>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helper components (unchanged visually)
// ---------------------------------------------------------------------------

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-2">
      <span className="text-[10px] text-slate-500 uppercase">{label}</span>
      <span className={cn("text-xs", color)}>{value}</span>
    </div>
  );
}

function ChannelLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? "_blank" : undefined}
      rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between p-5 bg-[#131313] hover:bg-[#201f1f] transition-all duration-300 border border-white/5 active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <span className="text-[#9cff93] group-hover:text-[#00f1fe] transition-colors">{icon}</span>
        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      </div>
      <ArrowRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function PostCard({ post, onClick }: { post: PostMeta; onClick: () => void }) {
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

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.65rem] text-[#9cff93]/60 font-bold tracking-[0.2em] uppercase">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer" onClick={onClick}>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
      <div className={cn(
        "w-8 h-4 border transition-all relative",
        active ? "bg-[#9cff93]/20 border-[#9cff93]" : "bg-black border-white/20"
      )}>
        <motion.div
          animate={{ x: active ? 16 : 0 }}
          className={cn(
            "absolute top-0.5 left-0.5 w-2.5 h-2.5",
            active ? "bg-[#9cff93]" : "bg-white/20"
          )}
        />
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
    '> STARTING_TERMINAL_DAEMON'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `> [OK] SYNC_DATA_${Math.random().toString(36).substring(7).toUpperCase()}`,
        `> [INFO] HEARTBEAT_DETECTED_${Date.now()}`,
        `> [WARN] LATENCY_SPIKE_${Math.floor(Math.random() * 100)}MS`,
        `> [OK] ENCRYPTION_ROTATED`,
        `> [INFO] LOG_ENTRY_VERIFIED`
      ];
      setLogs(prev => [...prev.slice(-10), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      {logs.map((log, i) => (
        <p key={i} className={cn(
          "opacity-80",
          log.includes('[OK]') && "text-[#9cff93]",
          log.includes('[WARN]') && "text-yellow-500",
          log.includes('[INFO]') && "text-[#00f1fe]"
        )}>
          {log}
        </p>
      ))}
      <p className="animate-pulse text-[#9cff93]">&gt; _</p>
    </div>
  );
}
