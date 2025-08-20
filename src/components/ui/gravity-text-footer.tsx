"use client";

import { useEffect, useRef } from "react";
import { Engine, Runner, World, Bodies, Body, Events, Mouse, MouseConstraint } from "matter-js";

export function GravityTextFooter() {
  const scene = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const blocksRef = useRef<Body[]>([]);

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;

    // Usa as dimensões do container pai em vez de window
    const container = scene.current;
    if (!container) return;
    
    const width = container.offsetWidth || 800;
    const height = 350;

    // Paredes físicas
    const floor = Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    World.add(world, [floor, leftWall, rightWall]);

    // Texto dividido em blocos
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

    // Cria blocos físicos e HTML
    blocksRef.current = words.map((word, index) => {
      const x = 120 + index * 160;
      const y = 0;

      const block = Bodies.rectangle(x, y, 200, 60, {
        friction: 1,
        restitution: 0,
        frictionAir: 0.3,
        inertia: Infinity,
      });

      World.add(world, block);

      // Cria elemento HTML correspondente
      const div = document.createElement("div");
      div.className = `absolute px-6 py-3 bg-[#111111] border border-[#ff2a2a] 
        font-bold uppercase rounded-md shadow-lg text-xl ${word.color}`;
      div.style.width = "200px";
      div.style.height = "60px";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";
      div.style.pointerEvents = "none"; // Prevent blocking scrolls

      if (word.link) {
        const a = document.createElement("a");
        a.href = word.link;
        a.textContent = word.text;
        a.target = "_blank";
        a.style.pointerEvents = "auto"; // Re-enable for links
        div.appendChild(a);
      } else {
        div.textContent = word.text;
      }

      scene.current!.appendChild(div);

      // Atualiza posição/rotação do bloco no DOM
      Events.on(engine, "afterUpdate", () => {
        div.style.transform = `translate(${block.position.x - 100}px, ${block.position.y - 30}px) rotate(${block.angle}rad)`;

        // Se parar quase totalmente, congela
        if (
          Math.abs(block.velocity.x) < 0.01 &&
          Math.abs(block.velocity.y) < 0.01 &&
          Math.abs(block.angularVelocity) < 0.01
        ) {
          Body.setAngularVelocity(block, 0);
          Body.setVelocity(block, { x: 0, y: 0 });
        }
      });

      return block;
    });

    // Runner sem render de canvas
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div
      ref={scene}
      className="relative w-full h-[350px] bg-transparent overflow-visible"
      style={{ 
        position: 'relative', 
        zIndex: 1,
        pointerEvents: 'none' // Don't interfere with page scroll
      }}
    />
  );
}