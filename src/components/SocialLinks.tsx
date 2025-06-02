import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { siLeetcode, siCredly } from "simple-icons"; // Corrected import for simple-icons
import { Button } from "@/components/ui/button";

const socialLinks = [
    {
        name: "GitHub",
        url: "https://github.com/beherasunil",
        icon: FaGithub, // Reverted to react-icons
        description: "View my GitHub profile and repositories"
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/in/beherasunil",
        icon: FaLinkedin, // Reverted to react-icons
        description: "Connect with me on LinkedIn"
    },
    {
        name: "Email",
        url: "mailto:s@behera.dev",
        icon: HiMail, // Reverted to react-icons
        description: "Send me an email"
    },
    {
        name: "LeetCode",
        url: "https://leetcode.com/beherasunil/",
        icon: siLeetcode, // Keep simple-icons for LeetCode
        description: "View my LeetCode profile"
    },
    {
        name: "Credly",
        url: "https://www.credly.com/users/beherasunil/badges",
        icon: siCredly, // Keep simple-icons for Credly
        description: "View my Credly profile"
    }
];

export default function SocialLinks() {
    return (
        <div className="flex gap-3 sm:gap-4 justify-center sm:justify-end">
            {socialLinks.map((link) => {
                const IconComponent = link.icon;
                // Check if the icon is from simple-icons (an object with a path)
                if (typeof IconComponent === 'object' && IconComponent && 'path' in IconComponent) {
                    return (
                        <Button
                            key={link.name}
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                        >
                            <a
                                href={link.url}
                                target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                aria-label={`${link.name} - ${link.description}`}
                                title={link.description}
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-current"
                                    fill="currentColor"
                                >
                                    <path d={(IconComponent as { path: string }).path} />
                                </svg>
                            </a>
                        </Button>
                    );
                } else if (typeof IconComponent === 'function') {
                    // Handle react-icons (or other component-based icons)
                    const ActualIconComponent = IconComponent as React.ElementType;
                    return (
                        <Button
                            key={link.name}
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                        >
                            <a
                                href={link.url}
                                target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                aria-label={`${link.name} - ${link.description}`}
                                title={link.description}
                            >
                                <ActualIconComponent className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-current" />
                            </a>
                        </Button>
                    );
                }
                return null;
            })}
        </div>
    );
}
