"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  PublicFoundItem,
  getItemTitle,
  formatIndonesianDate,
  getCategoryRepresentativeImage,
} from "@/features/item/utils/public-item-utils";

interface Props {
  items: PublicFoundItem[];
}

/* ─── Easing ─── */
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const GAP = 28;

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function CarouselFoundItems({ items }: Props) {
  const total = items.length;

  /* state */
  const [idx, setIdx] = useState(0);
  const [detail, setDetail] = useState<PublicFoundItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [cWidth, setCWidth] = useState(0);
  const [iWidth, setIWidth] = useState(380);
  const [isPaused, setIsPaused] = useState(false);

  /* refs */
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startT = useRef(0);
  const dragDeltaRef = useRef(0);
  const wasDraggingRef = useRef(false);

  /* ── responsive measurement ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setCWidth(w);
      if (w < 640) setIWidth(w - 56);
      else if (w < 1024) setIWidth(300);
      else setIWidth(360);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── navigation ── */
  const goTo = useCallback(
    (n: number) => setIdx(Math.max(0, Math.min(n, total - 1))),
    [total]
  );
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);

  /* ── autoplay with pause on hover ── */
  useEffect(() => {
    if (isPaused || dragging || detail || total <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, dragging, detail, total]);

  /* ── keyboard ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (detail) {
        if (e.key === "Escape") closeDetail();
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, detail]);

  /* ── pointer / touch drag ── */
  const onDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    startX.current = e.clientX;
    startT.current = Date.now();
    dragDeltaRef.current = 0;
    wasDraggingRef.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const delta = e.clientX - startX.current;
      dragDeltaRef.current = delta;
      setDragDelta(delta);
      if (Math.abs(delta) > 10) {
        wasDraggingRef.current = true;
      }
    },
    [dragging]
  );

  const onUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const delta = dragDeltaRef.current;
    const duration = Date.now() - startT.current;
    const v = delta / Math.max(1, duration);
    const threshold = iWidth * 0.2;
    if (Math.abs(delta) > threshold || Math.abs(v) > 0.3) {
      if (delta < 0) {
        next();
      } else {
        prev();
      }
    }
    dragDeltaRef.current = 0;
    setDragDelta(0);
  }, [dragging, iWidth, next, prev]);

  /* ── detail panel ── */
  function openDetail(item: PublicFoundItem) {
    setDetail(item);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setDetailVisible(true))
    );
  }
  function closeDetail() {
    setDetailVisible(false);
    setTimeout(() => setDetail(null), 380);
  }
  function detailPrev() {
    const i = items.findIndex((x) => x.id === detail?.id);
    if (i > 0) {
      setDetail(items[i - 1]);
      setIdx(i - 1);
    }
  }
  function detailNext() {
    const i = items.findIndex((x) => x.id === detail?.id);
    if (i < total - 1) {
      setDetail(items[i + 1]);
      setIdx(i + 1);
    }
  }
  const detailIdx = detail ? items.findIndex((x) => x.id === detail.id) : -1;

  /* ── track position ── */
  const tx = cWidth / 2 - iWidth / 2 - idx * (iWidth + GAP) + dragDelta;

  /* ── empty state ── */
  if (total === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-300 mb-6"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <p className="text-xl font-semibold text-gray-400 mb-1">
          Belum Ada Barang Temuan
        </p>
        <p className="text-sm text-gray-400/70">
          Barang yang ditemukan akan ditampilkan di sini.
        </p>
      </section>
    );
  }

  /* ── render ── */
  return (
    <>
      <section className="py-12 md:py-20 overflow-hidden">
        {/* ── Title ── */}
        <div className="text-center mb-12 md:mb-20 px-4">
          <h1
            className="font-extrabold tracking-tight text-[#0d3b2e] leading-[0.95]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            Barang Temuan
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Daftar barang temuan yang telah diamankan
          </p>
        </div>

        {/* ── Carousel viewport ── */}
        <div
          ref={containerRef}
          className="relative select-none touch-pan-y py-4"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex will-change-transform py-2"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${tx}px)`,
              transition: dragging ? "none" : `transform 520ms ${EASE}`,
            }}
          >
            {items.map((item, i) => {
              const dist = Math.abs(i - idx);
              const active = i === idx;
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0"
                  style={{
                    width: `${iWidth}px`,
                    transform: `scale(${active ? 1 : 0.9})`,
                    opacity: dist > 2 ? 0 : active ? 1 : 0.45,
                    filter: active ? "none" : "brightness(0.9)",
                    transition: dragging ? "none" : `all 520ms ${EASE}`,
                    pointerEvents: "auto",
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      if (wasDraggingRef.current) {
                        e.preventDefault();
                        return;
                      }
                      if (active) openDetail(item);
                    }}
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3dbd84] group rounded-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(13,59,46,0.14)] cursor-pointer"
                    tabIndex={active ? 0 : -1}
                    style={{ pointerEvents: active ? "auto" : "none" }}
                    aria-label={`Lihat detail ${getItemTitle(item)}`}
                  >
                    {/* image */}
                    <div
                      className="relative overflow-hidden bg-gray-100"
                      style={{ aspectRatio: "3 / 4" }}
                    >
                      <Image
                        src={getCategoryRepresentativeImage(item.jenis.name)}
                        alt={`${item.jenis.name} — ${item.merek.name}`}
                        fill
                        sizes="(max-width: 768px) 80vw, 380px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        draggable={false}
                      />
                      {/* subtle gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                      {/* category tag */}
                      <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90 bg-black/25 backdrop-blur-[2px] px-3 py-1">
                        {item.jenis.name}
                      </span>
                    </div>

                    {/* caption */}
                    <div className="mt-4">
                      <h3 className="text-[1.05rem] font-bold text-[#0d3b2e] leading-snug">
                        {getItemTitle(item)}
                      </h3>
                      <p className="text-[0.82rem] text-gray-400 mt-1">
                        {item.warna.name} · {item.lokasi.name}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-center gap-8 mt-12 md:mt-16 px-4">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="w-11 h-11 flex items-center justify-center border border-[#0d3b2e]/15 text-[#0d3b2e] transition-all duration-200 hover:bg-[#0d3b2e] hover:text-white disabled:opacity-15 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3dbd84]"
            aria-label="Sebelumnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span className="text-sm font-medium text-gray-400 tabular-nums tracking-wider min-w-[56px] text-center select-none">
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={next}
            disabled={idx === total - 1}
            className="w-11 h-11 flex items-center justify-center border border-[#0d3b2e]/15 text-[#0d3b2e] transition-all duration-200 hover:bg-[#0d3b2e] hover:text-white disabled:opacity-15 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3dbd84]"
            aria-label="Selanjutnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DETAIL OVERLAY
          ══════════════════════════════════════════ */}
      {detail && (
        <div
          className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail: ${getItemTitle(detail)}`}
          onClick={closeDetail}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              opacity: detailVisible ? 1 : 0,
              backdropFilter: detailVisible ? "blur(6px)" : "blur(0px)",
              WebkitBackdropFilter: detailVisible ? "blur(6px)" : "blur(0px)",
              transition: `all 350ms ${EASE}`,
            }}
          />

          {/* panel */}
          <div
            className="relative z-10 bg-white w-full max-w-[900px] max-h-[92vh] overflow-y-auto overflow-x-hidden md:mx-6"
            style={{
              opacity: detailVisible ? 1 : 0,
              transform: detailVisible
                ? "translateY(0)"
                : "translateY(48px)",
              transition: `all 400ms ${EASE}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]">
              {/* ── Image ── */}
              <div
                className="relative bg-gray-100"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={getCategoryRepresentativeImage(detail.jenis.name)}
                  alt={detail.jenis.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-5 left-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white bg-black/25 backdrop-blur-[2px] px-3 py-1.5">
                  {detail.jenis.name}
                </span>
              </div>

              {/* ── Info ── */}
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center relative">
                {/* close btn */}
                <button
                  type="button"
                  onClick={closeDetail}
                  className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 flex items-center justify-center text-gray-300 hover:text-[#0d3b2e] transition-colors focus:outline-none"
                  aria-label="Tutup"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <div className="space-y-6">
                  {/* heading */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3dbd84] mb-2">
                      Barang Temuan
                    </p>
                    <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-[#0d3b2e] leading-tight">
                      {getItemTitle(detail)}
                    </h2>
                  </div>

                  <div className="w-10 h-px bg-[#0d3b2e]/10" />

                  {/* fields */}
                  <dl className="space-y-5">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Warna
                      </dt>
                      <dd className="text-[0.95rem] font-medium text-gray-800">
                        {detail.warna.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Lokasi Ditemukan
                      </dt>
                      <dd className="text-[0.95rem] font-medium text-gray-800">
                        {detail.lokasi.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Tanggal Ditemukan
                      </dt>
                      <dd className="text-[0.95rem] font-medium text-gray-800">
                        {formatIndonesianDate(detail.createdAt)}
                      </dd>
                    </div>
                    {detail.additionalDesc && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">
                          Keterangan
                        </dt>
                        <dd className="text-sm text-gray-600 leading-relaxed">
                          {detail.additionalDesc}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* ── Detail navigation ── */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={detailPrev}
                    disabled={detailIdx <= 0}
                    className="text-xs font-medium text-gray-400 hover:text-[#0d3b2e] transition-colors disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1.5 focus:outline-none"
                    aria-label="Barang sebelumnya"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    Sebelumnya
                  </button>
                  <span className="text-xs text-gray-400 tabular-nums tracking-wider">
                    {String(detailIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={detailNext}
                    disabled={detailIdx >= total - 1}
                    className="text-xs font-medium text-gray-400 hover:text-[#0d3b2e] transition-colors disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1.5 focus:outline-none"
                    aria-label="Barang selanjutnya"
                  >
                    Selanjutnya
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
