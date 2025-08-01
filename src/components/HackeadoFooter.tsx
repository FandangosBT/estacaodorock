"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gravity, MatterBody } from "@/components/ui/gravity";

export default function HackeadoFooter() {
  const fullText =
    "ESTE SITE FOI HACKEADO PELO CAOS CRIATIVO DE @OERICBARROS. TENHA VOCÊ TAMBÉM UM SITE QUE GRITE!";
  const words = fullText.split(" ");

  const [showGravity, setShowGravity] = useState(false);

  // Ativa Gravity depois que todas palavras forem reveladas
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGravity(true);
    }, words.length * 300 + 1000); // tempo baseado na animação de cada palavra
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* 1️⃣ Texto que aparece palavra por palavra */}
      <div className="text-center leading-tight px-6">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block mx-1 text-2xl md:text-4xl font-extrabold ${
              word.includes("@OERICBARROS")
                ? "text-yellow-400"
                : word === "GRITE!"
                ? "text-red-500"
                : "text-white"
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.2 }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* 2️⃣ Gravity: palavras viram blocos interativos */}
      {showGravity && (
        <div className="absolute bottom-0 left-0 w-full h-[400px] z-10">
          <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
            {words.map((word, i) => (
              <MatterBody
                key={i}
                matterBodyOptions={{
                  friction: 0.5,
                  restitution: 0.2,
                  density: 0.002,
                }}
                x={`${20 + i * 5}%`} // espalha horizontalmente
                y="0%" // começa do topo da área Gravity
              >
                <div
                  className={`px-4 py-2 text-sm font-bold uppercase rounded-md border ${
                    word.includes("@OERICBARROS")
                      ? "border-yellow-500 text-yellow-400 bg-black"
                      : word === "GRITE!"
                      ? "border-red-500 text-red-500 bg-black"
                      : "border-white/50 text-white bg-black"
                  }`}
                >
                  {word}
                </div>
              </MatterBody>
            ))}
          </Gravity>
        </div>
      )}
    </section>
  );
}