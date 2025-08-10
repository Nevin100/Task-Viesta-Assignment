import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ModeToggle } from "./toggle";

const Navbar = () => {
  return (
    <header className="bg-muted">
      <nav
        aria-label="Main Navigation"
        className="fixed top-6 inset-x-4 h-20 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full shadow-sm"
      >
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <NavMenu className="hidden md:block" />

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
            >
              Sign In
            </Button>
            <Button className="rounded-full">Get Started</Button>

            <div>
              <ModeToggle />
            </div>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
