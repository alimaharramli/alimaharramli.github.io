'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import {
  ArrowLeft,
  Share2,
  Download,
  User,
  Calendar,
  Clock,
  Copy,
  Twitter,
  Linkedin,
} from 'lucide-react';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/LayoutShell';

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.65rem] text-[#9cff93]/60 font-bold tracking-[0.2em] uppercase">
        {label}
      </p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

export function PostPageClient({ post }: { post: Post }) {
  const router = useRouter();
  const showToast = useToast();

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({ title: post.title, text: post.excerpt, url })
        .catch(() => {
          navigator.clipboard.writeText(url);
          showToast('URL_COPIED_TO_CLIPBOARD');
        });
    } else {
      navigator.clipboard.writeText(url);
      showToast('URL_COPIED_TO_CLIPBOARD');
    }
  }, [post, showToast]);

  const handleSocialShare = (platform: 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `[LOG_ENTRY] ${post.title}\n\n${post.excerpt}\n\n`
    );
    const shareUrl =
      platform === 'twitter'
        ? `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([post.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.id}.md`;
    document.body.appendChild(element);
    element.click();
    showToast('DATA_STREAM_DOWNLOADED');
  };

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
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[#262626] text-[0.65rem] text-[#00f1fe] font-bold border border-[#00f1fe]/20 uppercase tracking-wider"
              >
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
              <p className="text-[0.65rem] text-[#9cff93]/60 font-bold tracking-[0.2em] uppercase">
                AUTHOR
              </p>
              <p className="text-sm font-bold text-white">{post.author}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            System architect and security researcher. Specializing in
            kernel-level exploitation and automated fuzzing techniques.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            SHARE_STREAM
          </h4>
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
            <span className="text-[#9cff93] mr-4">&gt;</span>
            {post.title}
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
            onClick={() => router.push('/')}
            className="group flex items-center gap-4 text-[#9cff93] font-bold tracking-tighter uppercase transition-all"
          >
            <ArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-2"
            />
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
