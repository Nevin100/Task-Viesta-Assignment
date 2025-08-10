import Hero from "@/components/Custom/Hero";
import Features from "@/components/Custom/Features";
import FAQ from "@/components/Custom/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 ">
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
}
