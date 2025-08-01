import { Hero } from "@/components/ui/animated-hero"
import { HoverImageGallery } from "@/components/ui/hover-image-gallery";

function HeroDemo() {
  return (
    <div className="block">
      <Hero />
    </div>
  );
}

function DemoGallery() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <HoverImageGallery />
      <p className="mt-10 text-gray-400 uppercase text-sm tracking-wider">
        Passe o mouse sobre as imagens
      </p>
    </div>
  );
}

export { HeroDemo, DemoGallery };