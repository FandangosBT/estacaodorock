"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedTitle() {
  const [titleNumber, setTitleNumber] = useState(0);

  // Palavras que vão alternar
  const titles = useMemo(
    () => ["CAÓTICO", "BRUTAL", "INSANO", "HISTÓRICO", "INCONTROLÁVEL"],
    []
  );

  // Intervalo para alternar palavras
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider text-white text-center font-[Bebas_Neue] animate-fadeInUp">
      ESTAÇÃO ROCK{" "}
      <span className="text-[#ffbd00]">2025</span>{" "}
      <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 text-[#ff2a2a] ml-2">
        &nbsp;
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-semibold"
            initial={{ opacity: 0, y: "-100" }}
            transition={{ type: "spring", stiffness: 50 }}
            animate={
              titleNumber === index
                ? {
                    y: 0,
                    opacity: 1,
                  }
                : {
                    y: titleNumber > index ? -150 : 150,
                    opacity: 0,
                  }
            }
          >
            {title}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

export default AnimatedTitle;