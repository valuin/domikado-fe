"use client";
import * as React from "react";
import { createPortal } from "react-dom";

/* -------------------------------------------------------------------------------------------------
 * This is a basic tooltip created for the chart demos. Customize as needed or bring your own solution.
 * -----------------------------------------------------------------------------------------------*/

type TooltipContextValue = {
  tooltip: { x: number; y: number } | undefined;
  setTooltip: (tooltip: { x: number; y: number } | undefined) => void;
  hoveredData: any; // To store the data of the hovered element
  setHoveredData: (data: any) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

function useTooltipContext(componentName: string): TooltipContextValue {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip must be used within a Tooltip Context");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tooltip, setTooltip] = React.useState<{ x: number; y: number }>();
  const [hoveredData, setHoveredData] = React.useState<any>(undefined);

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip, hoveredData, setHoveredData }}>
      {children}
    </TooltipContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = "TooltipTrigger";

const TooltipTrigger = React.forwardRef<HTMLDivElement, { children: React.ReactNode; data?: any }>(
  (props, forwardedRef) => {
    const { children, data } = props;
    const context = useTooltipContext(TRIGGER_NAME);
    const triggerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          context.setTooltip(undefined);
          context.setHoveredData(undefined);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [context]);

    return (
      <div
        ref={(node) => {
          // Maintain both refs
          triggerRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        onPointerMove={(event) => {
          // Only handle mouse events, not touch
          if (event.pointerType === "mouse") {
            context.setTooltip({ x: event.clientX, y: event.clientY });
            context.setHoveredData(data);
          }
        }}
        onPointerLeave={(event) => {
          // Only handle mouse events, not touch
          if (event.pointerType === "mouse") {
            context.setTooltip(undefined);
            context.setHoveredData(undefined);
          }
        }}
        onTouchStart={(event) => {
          // On mobile, trigger when clicked instead of hover. Change as needed.
          context.setTooltip({ x: event.touches[0].clientX, y: event.touches[0].clientY });
          context.setHoveredData(data);
          setTimeout(() => {
            context.setTooltip(undefined);
            context.setHoveredData(undefined);
          }, 2000);
        }}
      >
        {children}
      </div>
    );
  }
);

TooltipTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = "TooltipContent";

const TooltipContent = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>((props, forwardedRef) => {
  const { children } = props;
  const context = useTooltipContext(CONTENT_NAME);
  const runningOnClient = typeof document !== "undefined";
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Calculate position based on viewport
  const getTooltipPosition = () => {
    if (!tooltipRef.current || !context.tooltip) return {};

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const viewportWidth = window.innerWidth;
    const willOverflowRight = context.tooltip.x + tooltipWidth + 10 > viewportWidth;

    return {
      top: context.tooltip.y - 20,
      left: willOverflowRight ? context.tooltip.x - tooltipWidth - 10 : context.tooltip.x + 10,
    };
  };

  if (!context.tooltip || !runningOnClient || !context.hoveredData) {
    return null;
  }

  const isMobile = window.innerWidth < 768;
  console.log(context.hoveredData.parent);

  return createPortal(
    isMobile ? (
      <div
        className="fixed h-fit z-60 w-fit rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3"
        style={{
          top: context.tooltip.y,
          left: context.tooltip.x + 20,
        }}
      >
        {children || (
          <>
            <div className="font-bold text-base mb-1">
              {context.hoveredData.parent?.data.name} Breakdown
            </div>
            <div className="grid gap-1.5">
              {context.hoveredData.parent?.children.map((child: any, index: number) => {
                const totalParentValue = context.hoveredData.parent?.value || 1;
                const percentage = ((child.value / totalParentValue) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor: context.hoveredData.parent?.data.color,
                        }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {child.data.name}
                      </span>
                    </div>
                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                      {child.data.value?.toLocaleString()}
                      <span className="text-muted-foreground font-normal">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                Total
                <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                  {context.hoveredData.parent?.value?.toLocaleString()}
                  <span className="text-muted-foreground font-normal">
                    schools
                  </span>
                </div>
              </div>
              {context.hoveredData.parent?.data.ratio && (
                <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                  Ratio
                  <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                    1:{context.hoveredData.parent.data.ratio.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    ) : (
      <div
        ref={tooltipRef}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-sm fixed z-50"
        style={getTooltipPosition()}
      >
        {children || (
          <>
            <div className="font-bold text-base mb-1">
              {context.hoveredData.parent?.data.name} Breakdown
            </div>
            <div className="grid gap-1.5">
              {context.hoveredData.parent?.children.map((child: any, index: number) => {
                const totalParentValue = context.hoveredData.parent?.value || 1;
                const percentage = ((child.value / totalParentValue) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor: context.hoveredData.parent?.data.color,
                        }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {child.data.name}
                      </span>
                    </div>
                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                      {child.data.value?.toLocaleString()}
                      <span className="text-muted-foreground font-normal">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                Total
                <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                  {context.hoveredData.parent?.value?.toLocaleString()}
                  <span className="text-muted-foreground font-normal">
                    schools
                  </span>
                </div>
              </div>
              {context.hoveredData.parent?.data.ratio && (
                <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                  Ratio
                  <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                    1:{context.hoveredData.parent.data.ratio.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    ),
    document.body
  );
});

TooltipContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export { Tooltip as ClientTooltip, TooltipTrigger, TooltipContent };
