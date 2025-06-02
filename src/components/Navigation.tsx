import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="hover:bg-primary/10 hover:text-primary transition-colors"
    >
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Resume
      </a>
    </Button>
  );
}
