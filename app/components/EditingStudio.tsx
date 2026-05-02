"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, X, Plus, Minus, Upload, SlidersHorizontal, Palette } from "lucide-react";

interface PageTemplate {
  bgColor: string;
  bgImage?: string;
  frames?: number; // FUNGSI BARU: Menambahkan dukungan jumlah frame dinamis
}

interface EditingStudioProps {
  photos: string[];
  template: PageTemplate;
  onNext: (finalImage: string) => void;
  onBack: () => void;
}

type LayoutType = "classic" | "korean" | "luxury";
type StickerCategory = "elegant" | "vintage" | "cute" | "seasonal" | "custom";

interface Sticker {
  id: string;
  type: "emoji" | "image";
  content: string;
  x: number;
  y: number;
  size: number;
}

const STICKER_LIBRARY: Record<Exclude<StickerCategory, "custom">, { emoji: string; label: string }[]> = {
  elegant: [
    { emoji: "✦", label: "Gold Star" }, { emoji: "♛", label: "Crown" },
    { emoji: "◈", label: "Diamond" }, { emoji: "✿", label: "Flower" },
  ],
  vintage: [
    { emoji: "📸", label: "Camera" }, { emoji: "🎞️", label: "Film" },
    { emoji: "🕰️", label: "Clock" }, { emoji: "🌹", label: "Rose" },
  ],
  cute: [
    { emoji: "💕", label: "Hearts" }, { emoji: "🌸", label: "Sakura" },
    { emoji: "🎀", label: "Ribbon" }, { emoji: "🦋", label: "Butterfly" },
  ],
  seasonal: [
    { emoji: "🌿", label: "Leaf" }, { emoji: "❄️", label: "Snow" },
    { emoji: "🌷", label: "Tulip" }, { emoji: "🍂", label: "Autumn" },
  ],
};

const LAYOUTS: { id: LayoutType; label: string; desc: string }[] = [
  { id: "classic", label: "Classic Vertical", desc: "4 foto berjejer elegan" },
  { id: "korean", label: "Korean Booth", desc: "2x2 grid modern (Lebih Lebar)" },
  { id: "luxury", label: "Luxury Frame", desc: "1 foto besar + 3 mini (Lebih Lebar)" },
];

const FRAME_COLORS = [
  { color: "#FFFDF5", label: "Ivory" }, { color: "#1A0808", label: "Noir" },
  { color: "#2C1506", label: "Walnut" }, { color: "#722F37", label: "Burgundy" },
  { color: "#8B7355", label: "Mocha" }, { color: "#D4AF37", label: "Gold" },
];

const FONTS = [
  { id: "var(--font-sans)", label: "Modern (Sans)" },
  { id: "var(--font-serif)", label: "Elegant (Serif)" },
  { id: "monospace", label: "Typewriter" },
  { id: "cursive", label: "Handwriting" },
];

const FILTERS = [
  { id: "none", label: "Original", style: { filter: "none" } },
  { id: "vintage", label: "Vintage", style: { filter: "sepia(0.35) contrast(1.1) brightness(0.95)" } },
  { id: "cinematic", label: "Cinematic", style: { filter: "contrast(1.15) saturate(0.8) brightness(0.9)" } },
  { id: "bw", label: "Noir B&W", style: { filter: "grayscale(1) contrast(1.1)" } },
];

export function EditingStudio({ photos, template, onNext, onBack }: EditingStudioProps) {
  const [layout, setLayout] = useState<LayoutType>("classic");
  const [frameColor, setFrameColor] = useState(template?.bgColor || "#FFFDF5");
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCustomFilter, setIsCustomFilter] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);

  const [stickerCategory, setStickerCategory] = useState<StickerCategory>("elegant");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [activeTab, setActiveTab] = useState<"layout" | "stickers" | "text" | "filter">("layout");
  
  const [nameText, setNameText] = useState("");
  const [dateText, setDateText] = useState(new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
  const [quoteText, setQuoteText] = useState("");
  const [fontFamily, setFontFamily] = useState(FONTS[0].id);
  const [customTextColor, setCustomTextColor] = useState(""); 
  const [watermarkSize, setWatermarkSize] = useState(10);
  
  const stripRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC ---
  const getFilterStyleStr = () => {
    if (isCustomFilter) {
      return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
    }
    return FILTERS.find((f) => f.id === selectedFilter)?.style.filter || "none";
  };

  const handleUploadSticker = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setStickers([...stickers, { id: Date.now().toString(), type: "image", content: ev.target.result as string, x: 50, y: 50, size: 80 }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomBgImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmojiSticker = (emoji: string) => {
    setStickers([...stickers, { id: Date.now().toString(), type: "emoji", content: emoji, x: 50, y: 50, size: 40 }]);
  };

  const removeSticker = (id: string) => setStickers(stickers.filter((s) => s.id !== id));
  const updateStickerSize = (id: string, delta: number) => {
    setStickers(stickers.map(s => s.id === id ? { ...s, size: Math.max(20, s.size + delta) } : s));
  };

  // --- DOM TO CANVAS EXPORT ---
  const handleExport = async () => {
    if (!stripRef.current) return;
    setIsExporting(true);

    try {
      const stripEl = stripRef.current;
      const stripRect = stripEl.getBoundingClientRect();
      
      const scale = 1600 / Math.max(stripRect.width, stripRect.height);
      const canvas = document.createElement("canvas");
      canvas.width = stripRect.width * scale;
      canvas.height = stripRect.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Gambar Background
      if (customBgImage) {
        const bgObj = new Image();
        bgObj.src = customBgImage;
        await new Promise((resolve) => (bgObj.onload = resolve));
        ctx.drawImage(bgObj, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Gambar Foto + Filter
      const images = Array.from(stripEl.querySelectorAll("img.photo-element")) as HTMLImageElement[];
      for (const img of images) {
        const imgRect = img.getBoundingClientRect();
        const x = (imgRect.left - stripRect.left) * scale;
        const y = (imgRect.top - stripRect.top) * scale;
        const w = imgRect.width * scale;
        const h = imgRect.height * scale;

        const imageObj = new Image();
        imageObj.src = img.src;
        await new Promise((resolve) => (imageObj.onload = resolve));

        const filterStr = getFilterStyleStr();
        if (filterStr && filterStr !== "none") ctx.filter = filterStr;
        ctx.drawImage(imageObj, x, y, w, h);
        ctx.filter = "none";
      }

      // 3. Gambar Teks Kustom
      const textElements = Array.from(stripEl.querySelectorAll(".export-text"));
      textElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left - stripRect.left) * scale;
        const y = (rect.top - stripRect.top) * scale;
        const computedStyle = window.getComputedStyle(el);
        
        ctx.font = `${computedStyle.fontWeight} ${parseFloat(computedStyle.fontSize) * scale}px ${computedStyle.fontFamily}`;
        ctx.fillStyle = computedStyle.color;
        ctx.textAlign = "center";
        ctx.fillText(el.textContent || "", x + (rect.width * scale) / 2, y);
      });

      // 4. Gambar Stiker
      const stickerElements = Array.from(stripEl.querySelectorAll(".export-sticker"));
      for (const el of stickerElements) {
        const parentRect = el.parentElement!.getBoundingClientRect(); 
        const x = (parentRect.left - stripRect.left) * scale;
        const y = (parentRect.top - stripRect.top) * scale;
        
        if (el.tagName.toLowerCase() === 'img') {
          const imgObj = new Image();
          imgObj.src = (el as HTMLImageElement).src;
          await new Promise((resolve) => (imgObj.onload = resolve));
          ctx.drawImage(imgObj, x, y, parentRect.width * scale, parentRect.height * scale);
        } else {
          const computedStyle = window.getComputedStyle(el);
          ctx.font = `${parseFloat(computedStyle.fontSize) * scale}px sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(el.textContent || "", x, y);
        }
      }

      const finalDataUrl = canvas.toDataURL("image/png", 1.0);
      onNext(finalDataUrl); 
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // --- RENDER LAYOUT ---
  const renderStrip = () => {
    const filterStyleStr = getFilterStyleStr();
    const backgroundStyle = {
      backgroundColor: frameColor !== "transparent" ? frameColor : undefined,
      backgroundImage: customBgImage ? `url(${customBgImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    
    const defaultAutoColor = customBgImage ? "#FFFFFF" : ((frameColor === "#FFFDF5" || frameColor === "#F5ECD7" || frameColor === "#F0E6D2" || frameColor === "#ffffff") ? "#3D1F0A" : "#D4AF37");
    const activeTextColor = customTextColor || defaultAutoColor;

    // FUNGSI BARU: Ambil batasan foto dinamis dari template
    const maxPhotos = template.frames || 4;

    const renderPhoto = (i: number) => (
      <div key={i} className="w-full h-full relative z-10 border border-[#D4AF37]/30 bg-black/10 overflow-hidden">
        {photos[i] && <img src={photos[i]} alt="Photo" className="photo-element w-full h-full object-cover bg-white" style={{ filter: filterStyleStr }} />}
      </div>
    );

    let layoutContent = null;

    // FUNGSI BARU: Logika rendering susunan foto dinamis berdasarkan maxPhotos
    if (layout === "classic") {
      layoutContent = (
        <div className="flex-1 flex flex-col gap-2">
          {Array.from({ length: maxPhotos }).map((_, i) => renderPhoto(i))}
        </div>
      );
    } else if (layout === "korean") {
      if (maxPhotos === 1) {
        layoutContent = <div className="flex-1 flex gap-2">{renderPhoto(0)}</div>;
      } else if (maxPhotos === 2) {
        layoutContent = (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 flex gap-2">{renderPhoto(0)}</div>
            <div className="flex-1 flex gap-2">{renderPhoto(1)}</div>
          </div>
        );
      } else if (maxPhotos === 3) {
        layoutContent = (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 flex gap-2">{renderPhoto(0)}</div>
            <div className="flex-1 flex gap-2">{renderPhoto(1)}{renderPhoto(2)}</div>
          </div>
        );
      } else {
        layoutContent = (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 flex gap-2">{renderPhoto(0)}{renderPhoto(1)}</div>
            <div className="flex-1 flex gap-2">{renderPhoto(2)}{renderPhoto(3)}</div>
          </div>
        );
      }
    } else if (layout === "luxury") {
      if (maxPhotos === 1) {
         layoutContent = <div className="flex-1 flex gap-2">{renderPhoto(0)}</div>;
      } else {
         layoutContent = (
           <div className="flex-1 flex flex-col gap-2">
             <div className="flex-[2]">{renderPhoto(0)}</div>
             <div className="flex-1 flex gap-2">
                {Array.from({ length: maxPhotos - 1 }).map((_, i) => renderPhoto(i + 1))}
             </div>
           </div>
         );
      }
    }

    return (
      <div className="w-full h-full flex flex-col p-3 lg:p-4 relative" style={backgroundStyle}>
        {customBgImage && <div className="absolute inset-0 bg-black/20" />}
        
        <div className="flex-1 relative z-10 flex flex-col">
            {layoutContent}
        </div>

        <div className="flex-none text-center py-1 mt-2 flex flex-col items-center justify-end gap-0.5 relative z-10" style={{ color: activeTextColor, fontFamily }}>
          {nameText && <div className="w-full"><span className="export-text text-[10px] lg:text-xs font-semibold tracking-widest block w-full">{nameText}</span></div>}
          {dateText && <div className="w-full"><span className="export-text text-[8px] lg:text-[10px] opacity-80 block w-full">{dateText}</span></div>}
          {quoteText && <div className="w-full"><span className="export-text text-[8px] lg:text-[10px] italic opacity-70 block w-full">"{quoteText}"</span></div>}
          <div className="mt-1 w-full"><span className="export-text font-bold tracking-widest opacity-60 block w-full" style={{ fontFamily: "var(--font-serif)", fontSize: `${watermarkSize}px` }}>SNAPSTRIP</span></div>
        </div>
      </div>
    );
  };

  const TABS = [
    { id: "layout", label: "Layout" },
    { id: "stickers", label: "Stiker" },
    { id: "text", label: "Teks" },
    { id: "filter", label: "Filter" },
  ] as const;

  const aspectClass = layout === "classic" ? "aspect-[1/2.8]" : "aspect-[3/4]";

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: "#0D0505", fontFamily: "var(--font-sans)" }}>
      
      {/* NAVBAR */}
      <nav className="flex-none w-full z-40 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(13,5,5,0.9)", borderColor: "rgba(212,175,55,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 md:gap-2 text-[#C8B89A] hover:text-[#D4AF37] text-xs md:text-sm transition-colors">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Kembali</span>
          </button>
          <span style={{ fontFamily: "var(--font-serif)", color: "#D4AF37" }} className="text-base md:text-lg">Editing Studio</span>
          <motion.button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold disabled:opacity-50" style={{ background: "linear-gradient(135deg, #D4AF37, #A07820)", color: "#0D0505" }}>
            {isExporting ? "Memproses..." : "Selesai"} <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </motion.button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 max-w-7xl mx-auto w-full">
        
        {/* KIRI: PREVIEW */}
        <div className="flex-1 lg:w-[70%] flex flex-col min-h-0 border-r border-[#D4AF37]/20 relative bg-[#0D0505]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,0,0,0.1) 0%, transparent 70%)" }} />
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8 min-h-0 overflow-hidden relative z-10">
            <div className={`h-full ${aspectClass} max-h-full max-w-full flex items-center justify-center shadow-2xl relative transition-all duration-300`} style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.15)" }}>
                <div ref={stripRef} className="w-full h-full relative overflow-hidden bg-white">
                  {renderStrip()}
                  
                  {/* Render Stiker */}
                  {stickers.map((sticker) => (
                    <motion.div
                      key={sticker.id}
                      drag
                      dragMomentum={false}
                      className="absolute cursor-move select-none z-20"
                      style={{ left: sticker.x, top: sticker.y }}
                    >
                      {sticker.type === "emoji" ? (
                         <span className="export-sticker leading-none" style={{ fontSize: sticker.size }}>{sticker.content}</span>
                      ) : (
                         <img src={sticker.content} alt="sticker" className="export-sticker pointer-events-none" style={{ width: sticker.size, height: "auto" }} />
                      )}
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </div>

        {/* KANAN: PANEL EDITING */}
        <div className="flex-none lg:flex-1 lg:w-[30%] h-[40dvh] lg:h-auto flex flex-col bg-[#110805] min-h-0 border-t lg:border-t-0 border-[#D4AF37]/20">
          
          <div className="flex-none flex overflow-x-auto border-b border-[#D4AF37]/10 bg-[#0A0503]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 min-w-[80px] py-3 lg:py-4 text-[10px] lg:text-xs uppercase tracking-wider transition-all whitespace-nowrap"
                style={activeTab === tab.id ? { color: "#D4AF37", borderBottom: "2px solid #D4AF37", backgroundColor: "rgba(212,175,55,0.05)" } : { color: "#5A4A3A" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
            
            {/* LAYOUT TAB */}
            {activeTab === "layout" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {LAYOUTS.map((t) => (
                    <button key={t.id} onClick={() => setLayout(t.id)} className="w-full p-3 lg:p-4 rounded-xl text-left transition-all" style={layout === t.id ? { background: "linear-gradient(135deg, rgba(139,0,0,0.4), rgba(107,10,10,0.2))", border: "1px solid rgba(212,175,55,0.5)" } : { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
                      <div className="text-sm font-medium mb-1" style={{ color: layout === t.id ? "#D4AF37" : "#C8B89A" }}>{t.label}</div>
                      <div className="text-[10px] lg:text-xs text-[#5A4A3A]">{t.desc}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] lg:text-xs uppercase tracking-widest mb-3 text-[#D4AF37] flex items-center justify-between">
                    Warna Frame
                    <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-2 py-1 rounded border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">
                      <Palette className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[10px] text-[#C8B89A]">Custom</span>
                      <input type="color" value={frameColor} onChange={(e) => { setFrameColor(e.target.value); setCustomBgImage(null); }} className="opacity-0 w-0 h-0" />
                    </label>
                  </p>
                  <div className="grid grid-cols-6 lg:grid-cols-4 gap-2 mb-4">
                    {FRAME_COLORS.map(({ color, label }) => (
                      <button key={color} onClick={() => { setFrameColor(color); setCustomBgImage(null); }} title={label} className="aspect-square rounded-lg transition-all" style={{ backgroundColor: color, border: (frameColor === color && !customBgImage) ? "2px solid #D4AF37" : "2px solid rgba(212,175,55,0.2)" }} />
                    ))}
                  </div>
                  
                  <p className="text-[10px] lg:text-xs uppercase tracking-widest mb-3 text-[#D4AF37] mt-6">Custom Background</p>
                  <button onClick={() => bgInputRef.current?.click()} className="w-full py-3 rounded-xl border border-dashed border-[#D4AF37]/40 text-[#C8B89A] hover:bg-[#D4AF37]/10 transition-all text-xs flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" /> Unggah Frame (JPG/PNG)
                  </button>
                  {customBgImage && <button onClick={() => setCustomBgImage(null)} className="w-full mt-2 text-[10px] text-red-400">Hapus Custom Frame</button>}
                  <input type="file" ref={bgInputRef} accept="image/*" onChange={handleUploadBg} className="hidden" />
                </div>
              </div>
            )}

            {/* STICKERS TAB */}
            {activeTab === "stickers" && (
              <div>
                <div className="flex gap-1 flex-wrap mb-4">
                  {(["elegant", "vintage", "cute", "seasonal", "custom"] as StickerCategory[]).map((cat) => (
                    <button key={cat} onClick={() => setStickerCategory(cat)} className="px-3 py-1.5 rounded-full text-[10px] lg:text-xs capitalize transition-all" style={stickerCategory === cat ? { background: "linear-gradient(135deg, #D4AF37, #A07820)", color: "#0D0505" } : { backgroundColor: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", color: "#9A8A7A" }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {stickerCategory === "custom" ? (
                  <div className="text-center py-6 border border-dashed border-[#D4AF37]/30 rounded-xl bg-white/5">
                    <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-[#D4AF37] text-black font-semibold text-xs rounded-full inline-flex items-center gap-2 hover:bg-[#C9A227]">
                       <Upload className="w-3 h-3" /> Unggah PNG Transparan
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/png" onChange={handleUploadSticker} className="hidden" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {STICKER_LIBRARY[stickerCategory as Exclude<StickerCategory, "custom">].map((s, i) => (
                      <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => addEmojiSticker(s.emoji)} className="aspect-square rounded-xl flex items-center justify-center text-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20">
                        {s.emoji}
                      </motion.button>
                    ))}
                  </div>
                )}
                
                {stickers.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/10">
                    <p className="text-[10px] lg:text-xs uppercase tracking-widest mb-3 text-[#D4AF37]">Kelola Stiker (Ukuran & Hapus)</p>
                    <div className="flex flex-col gap-2">
                      {stickers.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                          <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                             {s.type === "emoji" ? <span className="text-xl">{s.content}</span> : <img src={s.content} className="max-w-full max-h-full object-contain" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateStickerSize(s.id, -10)} className="p-1.5 bg-black/40 rounded text-[#C8B89A] hover:text-[#D4AF37]"><Minus className="w-3 h-3"/></button>
                            <span className="text-[10px] w-4 text-center text-[#C8B89A]">{s.size}</span>
                            <button onClick={() => updateStickerSize(s.id, 10)} className="p-1.5 bg-black/40 rounded text-[#C8B89A] hover:text-[#D4AF37]"><Plus className="w-3 h-3"/></button>
                            <div className="w-px h-4 bg-[#D4AF37]/20 mx-1" />
                            <button onClick={() => removeSticker(s.id)} className="p-1.5 bg-red-900/30 rounded text-red-400 hover:bg-red-900/50"><X className="w-3 h-3"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TEXT TAB */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 block text-[#D4AF37]">Gaya Huruf (Font)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONTS.map(f => (
                      <button key={f.id} onClick={() => setFontFamily(f.id)} className="py-2 text-xs rounded-lg border transition-all" style={{ fontFamily: f.id, backgroundColor: fontFamily === f.id ? "rgba(212,175,55,0.2)" : "transparent", borderColor: fontFamily === f.id ? "#D4AF37" : "rgba(212,175,55,0.2)", color: fontFamily === f.id ? "#D4AF37" : "#C8B89A" }}>{f.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 flex items-center justify-between text-[#D4AF37]">
                      Warna Teks
                      <div className="flex items-center gap-2">
                         <button onClick={() => setCustomTextColor("")} className="text-[9px] text-[#C8B89A] hover:text-white">Auto</button>
                         <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-2 py-1 rounded border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">
                            <Palette className="w-3 h-3 text-[#D4AF37]" />
                            <input type="color" value={customTextColor || "#000000"} onChange={(e) => setCustomTextColor(e.target.value)} className="opacity-0 w-0 h-0" />
                         </label>
                      </div>
                   </label>
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 block text-[#D4AF37]">Nama / Judul</label>
                  <input type="text" value={nameText} onChange={(e) => setNameText(e.target.value)} placeholder="Nama kamu..." className="w-full px-4 py-3 rounded-xl text-xs lg:text-sm outline-none bg-white/5 border border-[#D4AF37]/30 text-[#FDF9F0]" />
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 block text-[#D4AF37]">Tanggal</label>
                  <input type="text" value={dateText} onChange={(e) => setDateText(e.target.value)} className="w-full px-4 py-3 rounded-xl text-xs lg:text-sm outline-none bg-white/5 border border-[#D4AF37]/30 text-[#FDF9F0]" />
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 block text-[#D4AF37]">Quote Khusus</label>
                  <textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="A timeless moment..." rows={2} className="w-full px-4 py-3 rounded-xl text-xs lg:text-sm outline-none resize-none bg-white/5 border border-[#D4AF37]/30 text-[#FDF9F0]" />
                </div>
                <div className="pt-2">
                   <label className="text-[10px] lg:text-xs uppercase tracking-widest mb-2 flex justify-between text-[#D4AF37]">
                     <span>Ukuran Watermark</span> <span>{watermarkSize}px</span>
                   </label>
                   <input type="range" min="6" max="24" value={watermarkSize} onChange={(e) => setWatermarkSize(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
                </div>
              </div>
            )}

            {/* FILTER TAB */}
            {activeTab === "filter" && (
              <div className="space-y-6">
                
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setIsCustomFilter(false)} className="flex-1 py-2 text-xs rounded-lg transition-all" style={{ backgroundColor: !isCustomFilter ? "rgba(212,175,55,0.2)" : "transparent", color: !isCustomFilter ? "#D4AF37" : "#9A8A7A" }}>Preset</button>
                  <button onClick={() => setIsCustomFilter(true)} className="flex-1 py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1" style={{ backgroundColor: isCustomFilter ? "rgba(212,175,55,0.2)" : "transparent", color: isCustomFilter ? "#D4AF37" : "#9A8A7A" }}><SlidersHorizontal className="w-3 h-3"/> Custom</button>
                </div>

                {!isCustomFilter ? (
                  <div className="space-y-2">
                    {FILTERS.map((f) => (
                      <button key={f.id} onClick={() => setSelectedFilter(f.id)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all" style={selectedFilter === f.id ? { background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,175,55,0.5)" } : { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#D4AF37]/20">
                          {photos[0] ? <img src={photos[0]} className="w-full h-full object-cover" style={f.style} /> : <div className="w-full h-full bg-[#D4AF37]/5" />}
                        </div>
                        <span className="text-xs lg:text-sm" style={{ color: selectedFilter === f.id ? "#D4AF37" : "#9A8A7A" }}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5 px-1">
                     <div>
                       <label className="text-xs text-[#C8B89A] flex justify-between mb-2"><span>Kecerahan (Brightness)</span> <span>{brightness}%</span></label>
                       <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
                     </div>
                     <div>
                       <label className="text-xs text-[#C8B89A] flex justify-between mb-2"><span>Kontras (Contrast)</span> <span>{contrast}%</span></label>
                       <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
                     </div>
                     <div>
                       <label className="text-xs text-[#C8B89A] flex justify-between mb-2"><span>Saturasi (Saturate)</span> <span>{saturate}%</span></label>
                       <input type="range" min="0" max="200" value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
                     </div>
                     <button onClick={() => { setBrightness(100); setContrast(100); setSaturate(100); }} className="w-full py-2 mt-2 border border-red-900/50 text-red-400 text-xs rounded-lg hover:bg-red-900/20 transition-colors">Reset Filter</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}