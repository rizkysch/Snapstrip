"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Upload, ArrowLeft, Sparkles, LayoutList } from "lucide-react";

import { LandingPage } from "./components/LandingPage";
import { CameraBooth } from "./components/CameraBooth";
import { EditingStudio } from "./components/EditingStudio";
import { ExportScreen } from "./components/ExportScreen";

type Page = 'landing' | 'template' | 'camera' | 'editing' | 'export';

export type Template = {
  id: string;
  name: string;
  frames: number;
  bgColor: string;
  textColor: string;
  bgImage?: string;
};

const DEFAULT_TEMPLATES: Template[] = [
  { id: "gold", name: "Luxury Gold", frames: 4, bgColor: "#D4AF37", textColor: "#0D0505" },
  { id: "dark", name: "Midnight Onyx", frames: 4, bgColor: "#1A1A1A", textColor: "#D4AF37" },
  { id: "cream", name: "Vintage Cream", frames: 4, bgColor: "#F5ECD7", textColor: "#5A4A3A" },
  { id: "white", name: "Minimalist", frames: 4, bgColor: "#FFFFFF", textColor: "#0D0505" },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(DEFAULT_TEMPLATES[0]);
  
  // STATE BARU: Untuk menyimpan pilihan jumlah foto (default 4)
  const [frameCount, setFrameCount] = useState<number>(4);

  const handleStart = () => {
    setCurrentPage('template');
  };

  const handlePhotosCapture = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setCurrentPage('editing');
  };

  const handleEditComplete = (exportedImage: string) => {
    setFinalImage(exportedImage);
    setCurrentPage('export');
  };

  const handleStartNew = () => {
    setPhotos([]);
    setFinalImage('');
    setSelectedTemplate(DEFAULT_TEMPLATES[0]);
    setFrameCount(4);
    setCurrentPage('landing');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const customTemplate: Template = {
          id: `custom-${Date.now()}`,
          name: "Custom Design",
          frames: frameCount,
          bgColor: "transparent",
          textColor: "#ffffff",
          bgImage: reader.result as string,
        };
        setSelectedTemplate(customTemplate);
      };
      reader.readAsDataURL(file);
    }
  };

  // Menggabungkan template terpilih dengan jumlah frame yang dipilih
  const activeTemplate = { ...selectedTemplate, frames: frameCount };

  return (
    <main className="min-h-screen bg-[#0D0505] overflow-hidden text-white">
      <AnimatePresence mode="wait">
        
        {currentPage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {currentPage === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <div className="max-w-4xl w-full">
              <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 text-[#D4AF37] mb-8 hover:opacity-80 transition">
                  <ArrowLeft className="w-5 h-5" /> Kembali
              </button>

              <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#D4AF37" }}>
                    Sesuaikan Sesi Anda
                  </h2>
                  <p className="text-[#C8B89A] max-w-md mx-auto">Pilih jumlah bingkai foto dan tema dasar untuk momen abadi Anda.</p>
              </div>

              {/* FITUR BARU: Pemilih Jumlah Frame */}
              <div className="mb-10 flex flex-col items-center">
                 <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                   <LayoutList className="w-4 h-4" /> Pilih Jumlah Take Foto
                 </p>
                 <div className="flex gap-2 bg-white/5 p-1.5 rounded-full border border-[#D4AF37]/20">
                    {[1, 2, 3, 4].map(num => (
                       <button
                          key={num}
                          onClick={() => setFrameCount(num)}
                          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                             frameCount === num 
                               ? "bg-gradient-to-r from-[#D4AF37] to-[#A07820] text-[#0D0505] shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                               : "text-[#C8B89A] hover:bg-white/10"
                          }`}
                       >
                          {num} Foto
                       </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {DEFAULT_TEMPLATES.map((tpl) => (
                    <motion.div
                      key={tpl.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`relative cursor-pointer p-1 rounded-2xl transition-all duration-500 ${
                        selectedTemplate.id === tpl.id ? "bg-gradient-to-b from-[#D4AF37] to-[#A07820]" : "bg-white/5"
                      }`}
                    >
                      <div className="bg-[#120A0A] rounded-[14px] p-4 flex flex-col items-center h-full">
                        <div className="w-full aspect-[2/3] rounded-lg mb-4 shadow-2xl flex flex-col gap-1 p-1.5" style={{ backgroundColor: tpl.bgColor }}>
                           {[...Array(frameCount)].map((_, i) => (
                             <div key={i} className="flex-1 bg-black/10 rounded-sm border border-black/5" />
                           ))}
                        </div>
                        <span className={`text-sm font-medium ${selectedTemplate.id === tpl.id ? "text-[#D4AF37]" : "text-[#C8B89A]"}`}>
                          {tpl.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  <label className="group relative cursor-pointer p-1 rounded-2xl bg-white/5 hover:bg-white/10 transition-all">
                    <div className="bg-[#120A0A] border border-dashed border-[#D4AF37]/30 rounded-[14px] p-4 flex flex-col items-center h-full justify-center">
                      <div className="w-full aspect-[2/3] rounded-lg mb-4 bg-white/5 flex items-center justify-center overflow-hidden">
                        {selectedTemplate.bgImage ? (
                          <img src={selectedTemplate.bgImage} className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-[#D4AF37]/50" />
                        )}
                      </div>
                      <span className="text-sm text-[#C8B89A]">Custom Design</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </div>
                  </label>
               </div>

               <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage('camera')}
                    className="group flex items-center gap-3 px-12 py-5 rounded-full text-lg font-bold shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #A07820 100%)", color: "#0D0505" }}
                  >
                    Buka Kamera Premium <Sparkles className="w-5 h-5" />
                  </motion.button>
               </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'camera' && (
          <motion.div key="camera" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            {/* Template aktif yang berisi informasi frameCount dipasangkan di sini */}
            <CameraBooth template={activeTemplate} onNext={handlePhotosCapture} onBack={() => setCurrentPage('template')} />
          </motion.div>
        )}

        {currentPage === 'editing' && (
          <motion.div key="editing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <EditingStudio photos={photos} template={activeTemplate} onNext={handleEditComplete} onBack={() => setCurrentPage('camera')} />
          </motion.div>
        )}

        {currentPage === 'export' && (
          <motion.div key="export" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.6 }}>
            <ExportScreen finalImage={finalImage} photos={photos} onStartNew={handleStartNew} onBack={() => setCurrentPage('editing')} />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}