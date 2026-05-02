"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, ArrowRight, Upload, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CameraBoothProps {
  template: any;
  onNext: (photos: string[]) => void;
  onBack: () => void;
}

export function CameraBooth({ template, onNext, onBack }: CameraBoothProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timerDuration, setTimerDuration] = useState(3);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);

  // AMBIL MAX PHOTOS DARI TEMPLATE (Jika undefined, gunakan 4 sebagai fallback)
  const maxPhotos = template.frames || 4;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      streamRef.current = stream;
      setIsStreaming(true);
    } catch (err: any) {
      let errorMessage = "Tidak bisa mengakses kamera.";
      if (err.name === "NotAllowedError") errorMessage = "Izin kamera ditolak. Berikan izin di browser Anda.";
      else if (err.name === "NotFoundError") errorMessage = "Kamera tidak ditemukan.";
      setCameraError(errorMessage);
    }
  };

  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [isStreaming]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Menyesuaikan logika upload dengan maxPhotos
    const availableSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotos((prev) => [...prev, e.target!.result as string].slice(0, maxPhotos));
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const capturePhoto = () => {
    // Menyesuaikan dengan maxPhotos
    if (!videoRef.current || !canvasRef.current || photos.length >= maxPhotos) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL("image/png");
      
      setPhotos((prev) => [...prev, photoData]);
      setFlashEffect(true);
      setTimeout(() => setFlashEffect(false), 400);
    }
  };

  const startCountdown = () => {
    if (photos.length >= maxPhotos || countdown !== null) return;
    
    let count = timerDuration;
    setCountdown(count);

    timerRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);
        capturePhoto();
      }
    }, 1000);
  };

  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleNext = () => {
    if (photos.length === 0) return;
    stopCamera();
    onNext(photos);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden" style={{ backgroundColor: "#0D0505", color: "#FDF9F0" }}>
      <AnimatePresence>
        {flashEffect && <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="fixed inset-0 bg-white z-[100] pointer-events-none" />}
      </AnimatePresence>

      <nav className="flex-none w-full z-40 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(13,5,5,0.9)", borderColor: "rgba(212,175,55,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between relative">
          <button onClick={onBack} className="flex items-center gap-1 md:gap-2 text-[#C8B89A] hover:text-[#D4AF37] transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Kembali</span>
          </button>
          <span className="text-lg md:text-xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2" style={{ color: "#D4AF37" }}>SnapStrip</span>
          <div className="flex items-center gap-3 z-10">
            <div className="px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs border uppercase tracking-widest font-semibold hidden md:block" style={{ borderColor: "rgba(212,175,55,0.3)", color: "#D4AF37" }}>
              {photos.length} / {maxPhotos} Foto
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} disabled={photos.length === 0}
              className="lg:hidden px-4 py-2 bg-[#D4AF37] text-[#0D0505] rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1 disabled:opacity-20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              LANJUT <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        
        <div className="flex-none lg:w-[22%] lg:min-w-[240px] flex flex-col h-24 sm:h-28 lg:h-full min-h-0 order-1">
          <div className="bg-[#FFFDF5] p-2 lg:p-4 rounded-sm shadow-2xl flex flex-col gap-2 lg:gap-3 border-t-[4px] lg:border-t-[12px] border-[#D4AF37] h-full min-h-0">
            <div className="text-center mb-1 lg:mb-2 hidden lg:block flex-none">
                <p className="text-black font-serif text-[10px] tracking-[0.3em] font-bold">SNAPSTRIP</p>
                <div className="h-px bg-black/10 w-full mt-1" />
            </div>

            {/* Kotak foto sekarang di-render dinamis berdasarkan maxPhotos */}
            <div className="flex flex-row lg:flex-col gap-2 w-full flex-1 min-h-0">
              {Array.from({ length: maxPhotos }).map((_, i) => (
                <div key={i} className="flex-1 relative bg-[#EAE7DC] rounded-sm flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                  {photos[i] ? (
                    <>
                      <img src={photos[i]} className="w-full h-full object-cover" alt={`Hasil jepretan ${i+1}`} />
                      <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 lg:top-2 lg:right-2 p-1 bg-black/80 rounded-full text-white hover:bg-red-600 transition-colors z-10"><X className="w-2 h-2 lg:w-3 lg:h-3" /></button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5 lg:gap-1 opacity-20">
                      <Camera className="w-4 h-4 lg:w-6 lg:h-6 text-black" />
                      <span className="text-black font-bold text-xs lg:text-base">{i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="hidden lg:block flex-none mt-2 pt-2 lg:mt-3 lg:pt-3 border-t border-black/5">
               <motion.button 
                whileHover={{ y: -2 }} onClick={handleNext} disabled={photos.length === 0}
                className="w-full py-3 lg:py-4 bg-[#0D0505] text-[#D4AF37] rounded-sm font-black text-xs lg:text-sm tracking-widest flex items-center justify-center gap-3 disabled:opacity-20 hover:shadow-[0_10px_20px_rgba(212,175,55,0.2)] transition-all"
               >
                 LANJUTKAN <ArrowRight className="w-4 h-4" />
               </motion.button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-3 lg:space-y-4 order-2 min-h-0">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[rgba(212,175,55,0.2)] min-h-0">
            {isStreaming ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#150C08] p-4 text-center">
                 {cameraError && <p className="text-red-400 mb-4 text-xs lg:text-sm bg-red-950/30 p-2 lg:p-3 rounded-lg border border-red-900/50">{cameraError}</p>}
                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startCamera} className="bg-[#D4AF37] text-[#0D0505] px-6 lg:px-8 py-3 lg:py-4 rounded-full font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-xs lg:text-sm">
                   <Camera className="w-4 h-4 lg:w-5 lg:h-5" /> AKTIFKAN KAMERA
                 </motion.button>
              </div>
            )}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute inset-0 flex items-center justify-center bg-black/20 z-30">
                  <span className="text-7xl lg:text-[10rem] font-black text-[#D4AF37]" style={{ textShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.6)" }}>{countdown}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-none bg-[#1A0F0A] p-3 sm:p-4 lg:p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 lg:gap-6">
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto border-b sm:border-0 border-white/5 pb-3 sm:pb-0">
              <span className="text-[10px] lg:text-xs uppercase tracking-widest text-[#9A8A7A] font-bold">Timer</span>
              <div className="flex gap-2">
                {[3, 5, 10].map((t) => (
                  <button key={t} onClick={() => setTimerDuration(t)} className={`w-10 h-8 lg:w-12 lg:h-10 rounded-lg text-xs lg:text-sm transition-all border font-bold ${timerDuration === t ? 'bg-[#D4AF37] text-[#0D0505] border-[#D4AF37]' : 'text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/10'}`}>{t}s</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 lg:gap-4 w-full sm:w-auto flex-1 justify-end">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-6 py-2.5 lg:py-3 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all font-semibold text-[10px] lg:text-xs">
                <Upload className="w-3 h-3 lg:w-4 lg:h-4" /> UPLOAD
              </button>
              {/* Tombol Ambil Foto diblokir jika foto >= maxPhotos */}
              <motion.button 
                whileHover={isStreaming && photos.length < maxPhotos ? { scale: 1.02 } : {}} whileTap={isStreaming && photos.length < maxPhotos ? { scale: 0.98 } : {}} disabled={!isStreaming || photos.length >= maxPhotos || countdown !== null} onClick={startCountdown}
                className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-4 lg:px-8 py-2.5 lg:py-3 rounded-xl bg-[#8B0000] text-white hover:bg-[#A00000] disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold shadow-lg border border-white/10 text-[10px] lg:text-xs"
              >
                <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                AMBIL FOTO
              </motion.button>
            </div>
          </div>
        </div>

      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}