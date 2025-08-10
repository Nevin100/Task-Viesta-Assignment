import Hero from "@/components/Custom/Hero";
import Features from "@/components/Custom/Features";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 ">
      <Hero />
      <Features />
    </div>
  );
}
