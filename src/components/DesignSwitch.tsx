import { type DesignMode, designModes } from "../lib/designMode";

type DesignSwitchProps = {
  designMode: DesignMode;
  onDesignModeChange: (mode: DesignMode) => void;
};

export default function DesignSwitch({
  designMode,
  onDesignModeChange,
}: DesignSwitchProps) {
  return (
    <div
      aria-label="Design selector"
      className="design-switch design-selector fixed right-5 top-5 z-50 inline-flex rounded-full border border-white/80 bg-transparent p-1"
    >
      {designModes.map((mode, index) => (
        <button
          key={mode.value}
          aria-pressed={designMode === mode.value}
          className={`design-selector-option min-w-8 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            designMode === mode.value
              ? "design-selector-active bg-transparent text-white underline underline-offset-4"
              : "bg-transparent text-white hover:text-white/80"
          }`}
          type="button"
          onClick={() => onDesignModeChange(mode.value)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
