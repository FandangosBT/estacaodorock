"use client";

import { Gravity, MatterBody } from "@/components/ui/gravity";

export function ChaosText() {
  const words = [
    { text: "Este site foi hackeado", color: "text-white" },
    { text: "pelo caos criativo de", color: "text-white" },
    { text: "@oericbarros", color: "text-[#ffbd00]", link: "https://www.instagram.com/oericbarros" },
    { text: "Tenha você também", color: "text-white" },
    { text: "um site que", color: "text-white" },
    { text: "GRITE!", color: "text-[#ff2a2a]" },
  ];

  // Função para gerar ângulo e posição aleatória
  const getRandomAngle = () => Math.random() * 30 - 15; // -15° a 15°
  const getRandomX = (index: number) => `${10 + index * 12 + Math.random() * 5}%`; // Espaçamento irregular
  const getRandomRestitution = () => 0.5 + Math.random() * 0.5; // 0.5 a 1.0

  return (
    <div className="relative w-full h-[500px] bg-black overflow-hidden flex items-center justify-center border-t border-[#ff2a2a]">
      <Gravity gravity={{ x: 0, y: 0.6 }} className="w-full h-full">
        {words.map((word, index) => (
          <MatterBody
            key={index}
            x={getRandomX(index)}
            y="0%"
            angle={getRandomAngle()}
            matterBodyOptions={{
              friction: 0.2,
              restitution: getRandomRestitution(),
              density: 0.001,
            }}
          >
            <div
              className={`px-6 py-3 bg-[#111111] border border-[#ff2a2a] font-bold uppercase rounded-md shadow-lg text-xl ${word.color} hover:animate-pulse cursor-pointer`}
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