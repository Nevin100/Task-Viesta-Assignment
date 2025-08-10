import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={3}
        repeatdelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
      />
      <div className="relative z-10 text-center max-w-3xl">
        <Badge className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full py-2 px-4 border-none text-sm tracking-wide">
          🚀 New Release — Kanban Productivity Suite
        </Badge>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold !leading-[1.15] tracking-tight">
          Transform The Way You{" "}
          <span className="text-primary">Manage Tasks</span>
        </h1>

        <p className="mt-6 text-[17px] md:text-lg text-muted-foreground leading-relaxed">
          Stay on top of every project with a beautiful, intuitive{" "}
          <strong>Kanban board</strong> designed for speed and clarity. Create,
          edit, and organize tasks seamlessly across <strong>Todo</strong>,{" "}
          <strong>In Progress</strong>, and <strong>Done</strong> — all while
          enjoying a distraction-free, responsive interface built with Shadcn
          UI.
        </p>

        <p className="mt-3 text-sm text-muted-foreground/80">
          Perfect for teams, freelancers, and anyone who wants a clear view of
          their workflow.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href={"/Kanban"}>
            <Button
              size="lg"
              className="rounded-full text-base px-6 py-3 cursor-pointer"
            >
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
