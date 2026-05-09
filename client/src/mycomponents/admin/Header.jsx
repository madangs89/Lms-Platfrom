import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Header = ({
  colors,
  title,
  bigScreenButtonText,
  smallScreenButtonText,
  onClick,
}) => {
  return (
    <div className="flex w-full md:justify-between md:flex-row flex-col md:items-center mt-3">
      <div className="flex flex-col gap-0.5">
        <h1
          className="text-xl sm:text-2xl font-semibold"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </h1>
        <p
          className="text-[12px] sm:text-[13px]"
          style={{ color: colors.textSecondary }}
        >
          Dashboard &gt; {title}
        </p>
      </div>
      <Button
        onClick={onClick}
        className="flex items-center cursor-pointer gap-1 px-3 h-9 text-[13px] rounded-md flex-shrink-0"
        style={{ background: colors.primaryHover, color: colors.sidebarText }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{bigScreenButtonText}</span>
        <span className="sm:hidden">{smallScreenButtonText}</span>
      </Button>
    </div>
  );
};

export default Header;
