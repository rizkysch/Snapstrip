"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Share2, RefreshCw, Printer, CheckCircle, ChevronLeft, Minus, Plus } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

interface ExportScreenProps {
  finalImage: string;
  photos: string[]; // Tetap disimpan untuk data statistik panel
  onStartNew: () => void;
  onBack: () => void; // Prop baru untuk kembali ke Editing Studio
}

export function ExportScreen({ finalImage, photos, onStartNew, onBack }: ExportScreenProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"strip" | "4x6" | "framed">("strip");
  const [quantity, setQuantity] = useState(1); // State baru untuk jumlah cetak

  // --- LOGIKA DOWNLOAD (Langsung menggunakan finalImage) ---
  const handleDownload = () => {
    if (!finalImage) return;
    
    // Loop untuk mengunduh sebanyak jumlah 'quantity'
    for (let i = 0; i < quantity; i++) {
      const link = document.createElement("a");
      link.download = `SnapStrip_${Date.now()}_copy${i + 1}.png`;
      link.href = finalImage;
      link.click();
    }

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  // --- LOGIKA SHARE ---
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My SnapStrip",
          text: "Check out my premium photostrip!",
          url: window.location.href
        });
        setShared(true);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
      setShared(true);
    }
    setTimeout(() => setShared(false), 3000);
  };

  // --- LOGIKA PRINT (Smart Layout for 2x6 duplication) ---
  const handlePrint = () => {
    if (!finalImage) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let pagesHtml = "";
    
    for (let i = 0; i < quantity; i++) {
      if (activeFormat === "strip") {
        // Jika strip, posisikan 2 gambar berdampingan (mengisi kertas 4x6)
        pagesHtml += `
          <div style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; page-break-after: always; padding: 10px; box-sizing: border-box;">
            <div style="display: flex; width: 100%; height: 100%; gap: 15px; justify-content: center;">
              <img src="${finalImage}" style="height: 100%; max-width: 48%; object-fit: contain; border: 1px dashed #ccc;" />
              <img src="${finalImage}" style="height: 100%; max-width: 48%; object-fit: contain; border: 1px dashed #ccc;" />
            </div>
          </div>
        `;
      } else {
        // Jika format lain (misal 4x6 grid atau luxury), cetak 1 gambar penuh
        pagesHtml += `
          <div style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; page-break-after: always; padding: 10px; box-sizing: border-box;">
             <img src="${finalImage}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>
        `;
      }
    }

    printWindow.document.write(`
      <html>
        <head><title>Print SnapStrip - ${quantity} Copies</title></head>
        <body style="margin: 0; background: white;" onload="setTimeout(() => { window.print(); window.close(); }, 800)">
          ${pagesHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const PRINT_FORMATS = [
    { id: "strip", label: "Photo Strip", size: "2×6 inch" },
    { id: "4x6", label: "4×6 Print", size: "Standard" },
    { id: "framed", label: "Framed", size: "Premium" },
  ] as const;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#0D0505", fontFamily: "var(--font-sans)" }}
    >
      {/* Latar Belakang & Dekorasi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: "600px", height: "700px", background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.18) 0%, rgba(139,0,0,0.1) 30%, transparent 70%)" }} />
      <div className="absolute left-0 top-0 bottom-0 w-48 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(139,0,0,0.15), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(139,0,0,0.15), transparent)" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-40 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(13,5,5,0.9)", borderColor: "rgba(212,175,55,0.2)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          
          {/* Tombol Kembali ke Editing */}
          <button onClick={onBack} className="flex items-center gap-2 text-[#C8B89A] hover:text-[#D4AF37] transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Kembali</span>
          </button>

          {/* Logo SnapStrip (Berfungsi sebagai tombol ke Home) */}
          <button 
            onClick={onStartNew} 
            className="text-xl tracking-wide absolute left-1/2 -translate-x-1/2 hover:scale-105 transition-transform" 
            style={{ fontFamily: "var(--font-serif)", color: "#D4AF37", fontWeight: 600 }}
            title="Kembali ke Beranda"
          >
            SnapStrip
          </button>

          <p className="text-xs uppercase tracking-widest hidden md:block z-10" style={{ color: "rgba(212,175,55,0.6)" }}>
            ✦ Final Preview ✦
          </p>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="pt-24 pb-16 px-6 relative z-10">
        
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8, delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5" style={{ background: "linear-gradient(135deg, #D4AF37, #8B6914)", boxShadow: "0 0 40px rgba(212,175,55,0.4)" }}>
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="mb-3" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#FDF9F0", lineHeight: 1.15 }}>
            Your Strip is <em style={{ color: "#D4AF37" }}>Ready</em>
          </h1>
          <p className="text-base" style={{ color: "#9A8A7A" }}>
            Karya fotomu sudah siap didownload dan dicetak
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,400px] gap-10 items-start">

          {/* ── PREVIEW STRIP (KIRI) ── */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(139,0,0,0.2) 0%, transparent 70%)" }} />

              {/* Bingkai Kayu Premium */}
              <div className="rounded-2xl p-1.5 relative" style={{ background: "linear-gradient(135deg, #D4AF37, #8B6914, #C9A227, #8B6914, #D4AF37)", boxShadow: "0 0 0 1px rgba(212,175,55,0.3), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(212,175,55,0.15)" }}>
                <div className="rounded-xl p-5" style={{ background: "linear-gradient(160deg, #3D1F0A, #2C1506, #1E0E04)" }}>
                  
                  {/* Foto Hasil Render (finalImage) langsung ditampilkan di sini */}
                  <div className="rounded-lg overflow-hidden flex items-center justify-center" style={{ width: "280px", background: "#FFFDF5", boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)" }}>
                    {finalImage ? (
                       <img src={finalImage} alt="Final Photobooth Result" className="w-full h-auto object-contain" />
                    ) : (
                       <div className="w-full aspect-[1/2.8] flex items-center justify-center text-[#D4AF37] opacity-50 text-sm">
                         Memuat Hasil...
                       </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Sparkles Bintang */}
              <motion.div animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-6 -right-6 text-3xl pointer-events-none" style={{ color: "#D4AF37" }}>✦</motion.div>
              <motion.div animate={{ y: [0, 12, 0], rotate: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-6 -left-6 text-2xl pointer-events-none" style={{ color: "#D4AF37" }}>✦</motion.div>
            </div>
          </motion.div>

          {/* ── PANEL AKSI (KANAN) ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="space-y-5">
            
            {/* Stats Informasi */}
            <div className="rounded-2xl p-5 flex gap-5" style={{ background: "linear-gradient(160deg, #1E0E04, #150904)", border: "1px solid rgba(212,175,55,0.2)" }}>
              {[
                { value: photos.length, label: "Foto" },
                { value: "HD", label: "Kualitas" },
                { value: "✓", label: "Ready" },
              ].map((stat, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "#D4AF37" }}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: "#5A4A3A" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Opsi Format & Kuantitas Cetak */}
            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(160deg, #1E0E04, #150904)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>✦ Format Print</p>
              <div className="flex gap-2">
                {PRINT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setActiveFormat(fmt.id)}
                    className="flex-1 py-3 rounded-xl text-xs text-center transition-all"
                    style={
                      activeFormat === fmt.id
                        ? { background: "rgba(139,0,0,0.4)", border: "1px solid rgba(212,175,55,0.5)", color: "#D4AF37" }
                        : { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)", color: "#5A4A3A" }
                    }
                  >
                    <div className="font-medium">{fmt.label}</div>
                    <div className="opacity-60 mt-0.5 text-[10px]">{fmt.size}</div>
                  </button>
                ))}
              </div>

              {/* FITUR BARU: Jumlah Cetak (Quantity) */}
              <div className="flex items-center justify-between mt-5 border-t border-[#D4AF37]/10 pt-4">
                 <span className="text-xs uppercase tracking-widest" style={{ color: "#D4AF37" }}>Jumlah Salinan</span>
                 <div className="flex items-center gap-4 bg-black/40 rounded-lg p-1 border border-[#D4AF37]/20">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-[#C8B89A] hover:text-[#D4AF37] hover:bg-white/5 rounded transition-all"><Minus className="w-4 h-4" /></button>
                   <span className="text-sm font-bold text-[#FDF9F0] w-6 text-center">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#C8B89A] hover:text-[#D4AF37] hover:bg-white/5 rounded transition-all"><Plus className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.button
                  key={downloaded ? "done" : "download"}
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(212,175,55,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: downloaded ? "linear-gradient(135deg, #2C6B2C, #1A4A1A)" : "linear-gradient(135deg, #D4AF37 0%, #A07820 100%)",
                    color: downloaded ? "#A0F0A0" : "#0D0505",
                    fontWeight: 700, fontSize: "1rem"
                  }}
                >
                  {downloaded ? (<><CheckCircle className="w-5 h-5" /> Berhasil Didownload!</>) : (<><Download className="w-5 h-5" /> Download HD ({quantity}x)</>)}
                </motion.button>
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3">
                 <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleShare} className="py-4 rounded-xl flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #8B0000, #6B0A0A)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontWeight: 600, fontSize: "0.9rem" }}>
                   {shared ? <CheckCircle className="w-4 h-4" /> : <FaInstagram className="w-4 h-4" />}
                   {shared ? "Tersalin!" : "Share"}
                 </motion.button>

                 <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handlePrint} className="py-4 rounded-xl flex items-center justify-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)", color: "#9A8A7A", fontWeight: 500, fontSize: "0.9rem" }}>
                   <Printer className="w-4 h-4" /> Print Hasil
                 </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(212,175,55,0.15)" }} />
              <span className="text-xs" style={{ color: "#5A4A3A" }}>atau</span>
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(212,175,55,0.15)" }} />
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onStartNew} className="w-full py-4 rounded-xl flex items-center justify-center gap-3 border transition-all" style={{ borderColor: "rgba(212,175,55,0.3)", color: "#D4AF37", backgroundColor: "rgba(212,175,55,0.05)" }}>
              <RefreshCw className="w-5 h-5" /> Buat Sesi Baru
            </motion.button>
          </motion.div>
        </div>

        {/* Footer Quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-center mt-16">
          <p className="text-sm italic" style={{ color: "rgba(212,175,55,0.4)", fontFamily: "var(--font-serif)" }}>"Every photo tells a story. Make yours timeless."</p>
          <p className="text-xs mt-2" style={{ color: "#3D2010" }}>SnapStrip — Premium Digital Photo Booth</p>
        </motion.div>
      </div>
    </div>
  );
}