"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + Math.floor(Math.random() * 8); // incremento irregular
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-dirtywhite font-heading">
      {/* Equalizer Bars */}
      <div className="flex space-x-2 mb-6 h-24 items-end">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: ["20%", "100%", "40%", "80%", "30%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1 + i * 0.2,
              repeatType: "reverse",
            }}
            className="w-4 bg-blood rounded-t"
          />
        ))}
      </div>

      {/* Barra estilo fita adesiva */}
      <div className="w-80 h-6 bg-[#111] border-2 border-blood mb-2 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-blood"
        />
      </div>

      {/* Porcentagem */}
      <p className="text-burnt text-2xl tracking-wider font-heading">
        {progress}%
      </p>

      {/* Status */}
      <p className="text-dirtywhite text-sm tracking-wide mt-2 font-body">
        Testando o microfone...
      </p>
    </div>
  );
}