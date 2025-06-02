import { useEffect, useState } from "react";

interface Badge {
  id: string;
  imageUrl: string;
}

// Your earned badges - replace with your actual badges
const earnedBadges: Badge[] = [
  {
    id: "1",
    imageUrl:
      "https://images.credly.com/images/2c848998-c56d-4b9d-afa3-1c736a9d7495/OCI25DOPOCP_cached_image_20250519-26-gjzpx3.png",
  },
  {
    id: "2",
    imageUrl:
      "https://images.credly.com/size/80x80/images/67479770-1db6-4ed3-af79-31072b1ea182/OCID25CP_cached_image_20250512-27-8m358s.png",
  },
  {
    id: "3",
    imageUrl:
      "https://images.credly.com/size/80x80/images/b9b5d0de-ea19-42a7-9bd9-37480c6ce8a3/OCI25GAIOCP_cached_image_20250410-28-vds79u.png",
  },
  {
    id: "4",
    imageUrl:
      "https://images.credly.com/size/340x340/images/34880f37-8ec8-4542-a78a-73ba6647208e/image.png",
  },
  {
    id: "5",
    imageUrl:
      "https://images.credly.com/size/340x340/images/c9ed294b-f8ac-48fa-a8c3-96dab1f110f2/image.png",
  },
  {
    id: "6",
    imageUrl:
      "https://images.credly.com/size/340x340/images/89efc3e7-842b-4790-b09b-9ea5efc71ec3/image.png",
  },
  {
    id: "7",
    imageUrl:
      "https://images.credly.com/size/340x340/images/6b924fae-3cd7-4233-b012-97413c62c85d/blob",
  },
  {
    id: "8",
    imageUrl:
      "https://images.credly.com/size/340x340/images/024d0122-724d-4c5a-bd83-cfe3c4b7a073/image.png",
  },
];

interface FloatingBadge extends Badge {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  rotationSpeed: number;
}

export default function BackgroundBadges() {
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    setMounted(true);    const generateNonOverlappingPosition = (
      newBadge: FloatingBadge,
      existingBadges: FloatingBadge[],
      margins: { x: number; y: number; width: number; height: number }
    ) => {
      const maxAttempts = 50; // Prevent infinite loops
      let attempts = 0;
      
      const checkOverlap = (x1: number, y1: number, size1: number, x2: number, y2: number, size2: number) => {
        // Convert percentage positions to pixel positions for overlap calculation
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const px1 = (x1 / 100) * viewportWidth;
        const py1 = (y1 / 100) * viewportHeight;
        const px2 = (x2 / 100) * viewportWidth;
        const py2 = (y2 / 100) * viewportHeight;
        
        // Calculate distance between centers
        const distance = Math.sqrt(Math.pow(px2 - px1, 2) + Math.pow(py2 - py1, 2));
        
        // Add some padding between badges (1.5x the combined radius)
        const minDistance = ((size1 + size2) / 2) * 1.5;
        
        return distance < minDistance;
      };
      
      while (attempts < maxAttempts) {
        const x = margins.x + Math.random() * margins.width;
        const y = margins.y + Math.random() * margins.height;
        
        // Check if this position overlaps with any existing badges
        const hasOverlap = existingBadges.some(existingBadge => 
          checkOverlap(x, y, newBadge.size, existingBadge.x, existingBadge.y, existingBadge.size)
        );
        
        if (!hasOverlap) {
          return { x, y };
        }
        
        attempts++;
      }
      
      // If we can't find a non-overlapping position after max attempts,
      // return a random position (fallback)
      const x = margins.x + Math.random() * margins.width;
      const y = margins.y + Math.random() * margins.height;
      return { x, y };
    };

    const generateFloatingBadges = () => {
      const badges: FloatingBadge[] = [];
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const badgesToShow = earnedBadges; // Always show all badges

      const getResponsiveSize = () => {
        if (isMobile) return 70 + Math.random() * 30; // 70-100px (was 90-120px)
        else if (isTablet) return 100 + Math.random() * 40; // 100-140px (was 110-150px)
        else return 110 + Math.random() * 50; // 110-160px (was 120-170px)
      };

      const getMargins = () => {
        if (isMobile) return { x: 5, y: 15, width: 90, height: 70 }; // Reduced x margin, increased width/height coverage
        else if (isTablet) return { x: 10, y: 20, width: 80, height: 60 }; // Adjusted for tablet
        else return { x: 10, y: 15, width: 80, height: 70 };
      };      const margins = getMargins();
      badgesToShow.forEach((badge) => {
        const size = getResponsiveSize();
        const tempBadge: FloatingBadge = {
          ...badge,
          x: 0,
          y: 0,
          size,
          opacity:
            isMobile
              ? 0.1 + Math.random() * 0.15
              : 0.15 + Math.random() * 0.2, // Lower opacity
          animationDelay: Math.random() * 20, // 0-20s delay
          rotationSpeed: 40 + Math.random() * 40, // 40-80s for slower movement
        };
        const position = generateNonOverlappingPosition(tempBadge, badges, margins); // Pass existing badges
        tempBadge.x = position.x;
        tempBadge.y = position.y;
        badges.push(tempBadge);
      });
      return badges;
    };

    const applyBadgeStyles = (badges: FloatingBadge[]) => {
      badges.forEach((badge) => {
        const element = document.querySelector(
          `[data-badge-id="${badge.id}"]`
        ) as HTMLElement;
        if (element) {
          element.style.left = `${badge.x}%`;
          element.style.top = `${badge.y}%`;
          element.style.width = `${badge.size}px`;
          element.style.height = `${badge.size}px`;
          element.style.opacity = badge.opacity.toString();
          element.style.animationDelay = `${badge.animationDelay}s`;
          // No rotation animation for now, can be added via CSS if desired
          // element.style.animationDuration = `${badge.rotationSpeed}s`;
          element.style.transform = "translate(-50%, -50%)";
        }
      });
    };

    const updateBadges = () => {
      setImagesLoaded(false);
      setLoadedCount(0);
      const badges = generateFloatingBadges();
      setFloatingBadges(badges);
      setTimeout(() => applyBadgeStyles(badges), 100);
      setTimeout(() => setImagesLoaded(true), 3000); // Force show after 3s
    };

    updateBadges();
    const handleResize = () => {
      setTimeout(updateBadges, 250);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || floatingBadges.length === 0) return null;

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000 ${
        imagesLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {!imagesLoaded && (
        <div className="absolute top-4 right-4 text-xs text-muted-foreground/50 pointer-events-none">
          Loading badges... {loadedCount}/{floatingBadges.length}
        </div>
      )}
      <div className="absolute inset-0 bg-background/10 dark:bg-background/20 backdrop-blur-[2px]" />

      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          imagesLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-background/10 to-background/15 dark:from-background/3 dark:via-background/5 dark:to-background/8" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-background/5 dark:bg-background/2 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-background/7 dark:bg-background/3 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 left-1/2 w-60 h-60 bg-background/4 dark:bg-background/1 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-background/2 dark:from-background/1 via-transparent to-background/3 dark:to-background/1" />
      </div>

      {floatingBadges.map((badge) => (
        <div
          key={badge.id}
          className="absolute animate-float" // Added animate-float class
          data-badge-id={badge.id}
          // Add a simple floating animation class if desired, e.g., \'animate-float\'
        >
          <img
            // Changed from next/image to img
            src={badge.imageUrl}
            alt="" // Decorative, so alt can be empty
            width={64} // Base width, actual size controlled by style
            height={64} // Base height
            className="w-full h-full object-contain rounded-lg badge-blur badge-performance"
            onLoad={() => {
              setLoadedCount((prev) => {
                const newCount = prev + 1;
                if (newCount >= floatingBadges.length) {
                  setImagesLoaded(true);
                }
                return newCount;
              });
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              setLoadedCount((prev) => {
                const newCount = prev + 1;
                if (newCount >= floatingBadges.length) {
                  setImagesLoaded(true);
                }
                return newCount;
              });
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-background/30 dark:from-background/50 via-transparent to-background/10 dark:to-background/30" />
    </div>
  );
}

export {}; // Add an empty export to ensure it's treated as a module
