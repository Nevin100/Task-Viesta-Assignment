import { Button } from "@/components/ui/button";
import { ArrowRight, Blocks, ListChecks, Moon, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Features = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-lg mx-auto py-12 px-6">
        <h2 className="text-3xl leading-10 sm:text-4xl md:text-[40px] md:leading-[3.25rem] font-bold tracking-tight">
          Your Workflow, Supercharged <br />
          Kanban Ticket Management Made Simple
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Mobile Media Placeholder */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl"></div>

            <span className="text-2xl font-semibold tracking-tight">
              Intuitive Kanban Stages
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <ListChecks className="shrink-0" />
                  <p className="-mt-0.5">
                    Organize tasks into <strong>To-Do</strong>,{" "}
                    <strong>In Progress</strong>, and <strong>Completed</strong>{" "}
                    with a smooth drag-and-drop experience.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Blocks className="shrink-0" />
                  <p className="-mt-0.5">
                    Visual workflow keeps your team focused and on track at a
                    glance.
                  </p>
                </div>
              </li>
            </ul>

            <Link href={"/Kanban"}>
              <Button className="mt-12 w-full">
                Start Managing <ArrowRight />
              </Button>
            </Link>
          </div>

          {/* Desktop Media Placeholder */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 relative overflow-hidden h-60 md:h-80 lg:h-96">
            <Image
              src="/Banner.jpg"
              alt="Banner"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Desktop Media Placeholder */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 relative overflow-hidden h-60 md:h-80 lg:h-96">
            <Image
              src="/MobileBanner.jpg"
              alt="MobileBanner"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Feature Card 2 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Mobile Media Placeholder */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl"></div>

            <span className="text-2xl font-semibold tracking-tight">
              Sleek, Flexible UI
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <Moon className="shrink-0" />
                  <p className="-mt-0.5">
                    Built-in theme toggle for light and dark modes — work your
                    way.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Smartphone className="shrink-0" />
                  <p className="-mt-0.5">
                    Fully responsive design that looks sharp on mobile, tablet,
                    and desktop.
                  </p>
                </div>
              </li>
            </ul>

            <Button className="mt-12 w-full">
              Try It Now <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
