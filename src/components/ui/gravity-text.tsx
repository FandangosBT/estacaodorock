"use client";

import { Gravity, MatterBody } from "@/components/ui/gravity";

const words = [
  { text: "ESTE SITE FOI", color: "text-white" },
  { text: "HACKEADO PELO CAOS CRIATIVO DE", color: "text-white" },
  {
    text: "@OERICBARROS",
    color: "text-[#ffbd00]",
    link: "https://www.instagram.com/oericbarros",
  },
  { text: "TENHA VOCÊ TAMBÉM", color: "text-white" },
  { text: "UM SITE QUE", color: "text-white" },
  { text: "GRITE!", color: "text-[#ff2a2a]" },
];

const getRandomX = (index: number) => `${10 + index * 12}%`;

export function GravityTextFooter() {
  return (
    <div className="relative w-full h-[350px] bg-black overflow-hidden flex items-center justify-center">
      <Gravity
        gravity={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        {words.map((word, index) => (
          <MatterBody
            key={index}
            x={getRandomX(index)}
            y="0%"
            angle={0} // começa reto
            matterBodyOptions={{
              friction: 1,         // Atrito forte para parar
              restitution: 0,      // Sem quicar
              density: 0.001,      // Densidade do corpo
            }}
          >
            <div
              className={`px-6 py-3 bg-[#111111] border border-[#ff2a2a] font-bold uppercase rounded-md shadow-lg text-xl ${word.color} hover:animate-pulse cursor-grab`}
            >
              {word.link ? (
                <a href={word.link} target="_blank" rel="noopener noreferrer">
                  {word.text}
                </a>
              ) : (
                word.text
              )}
            </div>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  );
}