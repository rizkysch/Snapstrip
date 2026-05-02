import { useState, useEffect } from "react";
import { Camera, Download, Layers, Sparkles, Star, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onStart: () => void;
}

const STRIP_PHOTOS = [
  "https://images.unsplash.com/photo-1713316236741-5926cd0f4f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBwb3J0cmFpdCUyMGVsZWdhbnQlMjBwaG90b2Jvb3RoJTIwc3RyaXAlMjBwaG90b3N8ZW58MXx8fHwxNzc3NjUyMzQ3fDA&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1629573818823-4cda30816a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcGhvdG8lMjBib290aCUyMGNsYXNzaWMlMjB3b29kZW4lMjBmcmFtZXxlbnwxfHx8fDE3Nzc2NTIzNDR8MA&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1705944601101-fdb49dbf884c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB2ZWx2ZXQlMjBjdXJ0YWluJTIwbHV4dXJ5JTIwc3RhZ2UlMjBkYXJrfGVufDF8fHx8MTc3NzY1MjM0NHww&ixlib=rb-4.1.0&q=80&w=400",
];

const FEATURES = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Live Camera Booth",
    desc: "Ambil foto langsung dari webcam dengan timer elegan",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Custom Photo Strip",
    desc: "Template strip mewah bergaya Korean & vintage studio",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Elegant Stickers",
    desc: "Koleksi stiker eksklusif bergaya emas & vintage",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Instant Download",
    desc: "Download kualitas HD dalam hitungan detik",
  },
];

const GoldSparkle = ({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0.8, 0],
      scale: [0, 1, 0.8, 0],
      y: [0, -30, -60],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <Star
      className="fill-current"
      style={{ width: size, height: size, color: "#D4AF37" }}
    />
  </motion.div>
);

export function LandingPage({ onStart }: LandingPageProps) {
  const [stripOffset, setStripOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStripOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#0D0505", fontFamily: "var(--font-sans)" }}
    >
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "rgba(13,5,5,0.85)",
          borderColor: "rgba(212,175,55,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #D4AF37, #8B6914)" }}
            >
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl tracking-wide"
              style={{ fontFamily: "var(--font-serif)", color: "#D4AF37", fontWeight: 600 }}
            >
              SnapStrip
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Template", "Gallery", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm transition-colors duration-200"
                style={{ color: "#C8B89A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C8B89A")}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            onClick={onStart}
            className="px-5 py-2 rounded-full text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #A07820)",
              color: "#0D0505",
              fontWeight: 600,
            }}
          >
            Mulai Sekarang
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(139,0,0,0.35) 0%, rgba(13,5,5,0) 70%)`,
            backgroundColor: "#0D0505",
          }}
        />

        {/* Curtain Left */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-8%" }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
          className="absolute left-0 top-0 bottom-0 w-[30%] pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, #6B0A0A 0%, #8B1010 60%, rgba(139,16,16,0) 100%)",
            boxShadow: "inset -40px 0 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Curtain fold lines */}
          {[15, 35, 55, 75].map((pct, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px opacity-20"
              style={{
                left: `${pct}%`,
                background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
              }}
            />
          ))}
          {/* Gold curtain top trim */}
          <div
            className="absolute top-0 left-0 right-0 h-4"
            style={{ background: "linear-gradient(to bottom, #C9A227, #8B6914)" }}
          />
        </motion.div>

        {/* Curtain Right */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "8%" }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
          className="absolute right-0 top-0 bottom-0 w-[30%] pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to left, #6B0A0A 0%, #8B1010 60%, rgba(139,16,16,0) 100%)",
            boxShadow: "inset 40px 0 80px rgba(0,0,0,0.6)",
          }}
        >
          {[15, 35, 55, 75].map((pct, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px opacity-20"
              style={{
                left: `${pct}%`,
                background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
              }}
            />
          ))}
          <div
            className="absolute top-0 left-0 right-0 h-4"
            style={{ background: "linear-gradient(to bottom, #C9A227, #8B6914)" }}
          />
        </motion.div>

        {/* Spotlight glow from top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Golden sparkles */}
        <GoldSparkle x="20%" y="25%" delay={0} size={12} />
        <GoldSparkle x="75%" y="20%" delay={0.8} size={8} />
        <GoldSparkle x="15%" y="65%" delay={1.5} size={10} />
        <GoldSparkle x="80%" y="70%" delay={0.4} size={14} />
        <GoldSparkle x="45%" y="15%" delay={1.2} size={9} />
        <GoldSparkle x="60%" y="80%" delay={2} size={11} />

        {/* Center Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
              style={{
                borderColor: "rgba(212,175,55,0.4)",
                backgroundColor: "rgba(212,175,55,0.08)",
                color: "#D4AF37",
              }}
            >
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm tracking-widest uppercase">Premium Photo Booth Experience</span>
            </motion.div>

            <h1
              className="mb-6 leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "#FDF9F0",
                lineHeight: 1.15,
              }}
            >
              Capture Your
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #F0C060, #C9A227)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                Timeless
              </span>
              <br />
              Moment
            </h1>

            <p
              className="mb-10 leading-relaxed max-w-md"
              style={{ color: "#C8B89A", fontSize: "1.1rem" }}
            >
              Elegant digital photobooth experience with custom strips, stickers, and instant downloads.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(212,175,55,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={onStart}
                className="px-8 py-4 rounded-full text-base transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #A07820 100%)",
                  color: "#0D0505",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                }}
              >
                Mulai Sekarang
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full text-base border transition-all duration-300"
                style={{
                  borderColor: "rgba(212,175,55,0.5)",
                  color: "#D4AF37",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(212,175,55,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                Lihat Template
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Photo Booth Frame */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center"
          >
            {/* Outer wooden-frame machine */}
            <div className="relative">
              {/* Machine body */}
              <div
                className="rounded-2xl p-5 relative"
                style={{
                  background:
                    "linear-gradient(160deg, #3D1F0A 0%, #2C1506 40%, #1E0E04 100%)",
                  boxShadow:
                    "0 0 0 2px #8B6914, 0 0 0 4px #3D1F0A, 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)",
                  width: "280px",
                }}
              >
                {/* Machine top label */}
                <div
                  className="text-center py-3 mb-4 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #8B0000, #6B0A0A)",
                    border: "1px solid rgba(212,175,55,0.4)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#D4AF37",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                    }}
                  >
                    SnapStrip
                  </span>
                </div>

                {/* Photo strip viewport / window */}
                <div
                  className="relative overflow-hidden rounded-xl"
                  style={{
                    height: "380px",
                    border: "2px solid #8B6914",
                    background: "#0A0A0A",
                    boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
                  }}
                >
                  {/* The animated strip */}
                  <motion.div
                    animate={{ y: [0, -240] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="flex flex-col gap-2 p-3"
                    style={{ width: "100%" }}
                  >
                    {[...STRIP_PHOTOS, ...STRIP_PHOTOS].map((photo, i) => (
                      <div
                        key={i}
                        className="rounded-lg overflow-hidden flex-shrink-0"
                        style={{
                          height: "160px",
                          border: "1px solid rgba(212,175,55,0.3)",
                        }}
                      >
                        <img
                          src={photo}
                          alt="strip preview"
                          className="w-full h-full object-cover"
                          style={{ filter: i % 2 === 1 ? "sepia(0.3) contrast(1.1)" : "none" }}
                        />
                      </div>
                    ))}
                  </motion.div>

                  {/* Top fade */}
                  <div
                    className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, #0A0A0A, transparent)" }}
                  />
                  {/* Bottom fade */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: "linear-gradient(to top, #0A0A0A, transparent)" }}
                  />
                </div>

                {/* Machine bottom controls */}
                <div className="flex justify-center gap-3 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: i === 1 ? "48px" : "28px",
                        height: i === 1 ? "48px" : "28px",
                        background:
                          i === 1
                            ? "linear-gradient(135deg, #D4AF37, #8B6914)"
                            : "linear-gradient(135deg, #4A2A10, #2C1506)",
                        boxShadow:
                          i === 1
                            ? "0 4px 12px rgba(212,175,55,0.4)"
                            : "inset 0 1px 0 rgba(212,175,55,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Ambient glow */}
              <div
                className="absolute -inset-6 -z-10 rounded-3xl opacity-30 blur-2xl"
                style={{ background: "radial-gradient(ellipse, #8B0000, transparent)" }}
              />

              {/* Floating gold accent */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-5 -right-8"
                style={{ color: "#D4AF37", fontSize: "2rem" }}
              >
                ✦
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-5 -left-8"
                style={{ color: "#D4AF37", fontSize: "1.5rem" }}
              >
                ✦
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6" style={{ backgroundColor: "#0D0505" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <p
              className="uppercase tracking-widest text-sm mb-4"
              style={{ color: "#D4AF37" }}
            >
              ✦ Why SnapStrip ✦
            </p>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "#FDF9F0",
              }}
            >
              The Premium Experience
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(212,175,55,0.12)" }}
                className="rounded-2xl p-8 transition-all duration-300 cursor-default"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,175,55,0.18)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,0,0,0.5), rgba(107,10,10,0.3))",
                    border: "1px solid rgba(212,175,55,0.3)",
                    color: "#D4AF37",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "#FDF9F0",
                    fontSize: "1.15rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9A8A7A" }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0D0505 0%, #1A0808 50%, #0D0505 100%)",
        }}
      >
        {/* Decorative lines */}
        <div
          className="absolute left-0 right-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="uppercase tracking-widest text-sm mb-4" style={{ color: "#D4AF37" }}>
              ✦ The Process ✦
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#FDF9F0",
              }}
            >
              Three Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* connecting line */}
            <div
              className="absolute top-1/4 left-1/6 right-1/6 h-px hidden md:block"
              style={{ background: "linear-gradient(90deg, #8B6914, #D4AF37, #8B6914)" }}
            />
            {[
              { num: "01", title: "Open Camera", desc: "Buka kamera atau upload foto dari device kamu" },
              { num: "02", title: "Edit & Customize", desc: "Pilih template, tambah stiker & teks elegan" },
              { num: "03", title: "Download & Share", desc: "Download HD atau langsung share ke social media" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative z-10"
                  style={{
                    background: "linear-gradient(135deg, #8B0000, #4A0000)",
                    border: "2px solid #D4AF37",
                    boxShadow: "0 0 24px rgba(212,175,55,0.2)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#D4AF37",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="mb-3"
                  style={{ fontFamily: "var(--font-serif)", color: "#FDF9F0", fontSize: "1.3rem" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: "#9A8A7A", maxWidth: "220px" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6" style={{ backgroundColor: "#0D0505" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl py-20 px-12 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, #1A0808, #2C0A0A)",
              border: "1px solid rgba(212,175,55,0.3)",
              boxShadow: "0 0 80px rgba(139,0,0,0.3), inset 0 1px 0 rgba(212,175,55,0.2)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 60%)",
              }}
            />
            <p
              className="uppercase tracking-widest text-sm mb-6 relative z-10"
              style={{ color: "#D4AF37" }}
            >
              ✦ Begin Your Session ✦
            </p>
            <h2
              className="mb-6 relative z-10"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#FDF9F0",
                lineHeight: 1.2,
              }}
            >
              Ready to Create Your
              <br />
              <em style={{ color: "#D4AF37" }}>Timeless</em> Photo Strip?
            </h2>
            <p className="mb-10 relative z-10" style={{ color: "#C8B89A" }}>
              Mulai pengalaman photobooth premium secara gratis. Tidak perlu registrasi.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="px-12 py-5 rounded-full text-lg relative z-10 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #A07820 100%)",
                color: "#0D0505",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              Mulai Sekarang — Gratis
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6 text-center border-t"
        style={{
          borderColor: "rgba(212,175,55,0.1)",
          backgroundColor: "#080303",
        }}
      >
        <span
          style={{ fontFamily: "var(--font-serif)", color: "#D4AF37", fontSize: "1.2rem" }}
        >
          SnapStrip
        </span>
        <p className="mt-2 text-xs" style={{ color: "#5A4A3A" }}>
          © 2026 SnapStrip. Premium Digital Photo Booth.
        </p>
      </footer>
    </div>
  );
}
