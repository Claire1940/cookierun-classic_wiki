"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Volume2, ExternalLink } from "lucide-react";

/**
 * 视频区组件
 *
 * 三态播放：
 * - idle: 显示 YouTube 海报 + 居中 Play 按钮（首屏不预加载 iframe，节省资源）
 * - auto: 进入视口后自动静音循环播放（autoplay=1&mute=1&loop=1）
 * - manual: 用户点击 Play 或 Unmute 后带声播放
 *
 * iframe 用 key={state} 强制重载，确保 mute/unmute 切换生效。
 */
type PlayState = "idle" | "auto" | "manual";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PlayState>("idle");

  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const embedUrl = useMemo(() => {
    if (state === "idle") return "";
    const muted = state === "auto" ? 1 : 0;
    return (
      `https://www.youtube.com/embed/${videoId}` +
      `?autoplay=1&mute=${muted}&loop=1&playlist=${videoId}` +
      `&playsinline=1&rel=0&modestbranding=1`
    );
  }, [videoId, state]);

  // 进入视口自动静音循环播放（仅 idle 时挂载，触发一次后断开）
  useEffect(() => {
    if (state !== "idle") return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // 不支持 IntersectionObserver 的环境直接自动播放
      setState("auto");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setState("auto");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.45, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [state]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {/* 海报 + Play 按钮（idle 状态） */}
        {state === "idle" && (
          <button
            type="button"
            onClick={() => setState("manual")}
            aria-label={`Play ${title}`}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition-transform hover:scale-110 md:h-20 md:w-20">
                <Play className="h-7 w-7 fill-white md:h-9 md:w-9" />
              </span>
            </span>
          </button>
        )}

        {/* iframe（auto / manual 状态） */}
        {state !== "idle" && (
          <iframe
            key={state}
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}

        {/* Unmute 按钮（auto 状态，静音播放时提示开声） */}
        {state === "auto" && (
          <button
            type="button"
            onClick={() => setState("manual")}
            aria-label="Unmute video"
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <Volume2 className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
            Tap for sound
          </button>
        )}

        {/* 无 JS 回退：静音自动播放 iframe */}
        <noscript>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </noscript>
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
