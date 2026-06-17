"use client";

import { cn } from "@/lib/utils";
import { SetStateActionType } from "@/types/set-state-action-type";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type Placement,
} from "@floating-ui/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
} from "react";

type DropdownContextType = {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  setPlacement: (placement: Placement) => void;
  refs: ReturnType<typeof useFloating>["refs"];
  floatingStyles: CSSProperties;
  strategy: CSSProperties["position"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext must be used within a Dropdown");
  }
  return context;
}

type DropdownProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: SetStateActionType<boolean>;
};

export function Dropdown({ children, isOpen, setIsOpen }: DropdownProps) {
  const [placement, setPlacement] = useState<Placement>("bottom");

  const { refs, floatingStyles, context, strategy } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ availableHeight, elements, rects }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(160, availableHeight - 8)}px`,
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  function handleClose() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        handleOpen,
        handleClose,
        setPlacement,
        refs,
        floatingStyles,
        strategy,
        getReferenceProps,
        getFloatingProps,
      }}
    >
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  );
}

type DropdownContentProps = {
  align?: "start" | "end" | "center";
  className?: string;
  children: React.ReactNode;
  style?: CSSProperties;
};

export function DropdownContent({
  children,
  align = "center",
  className,
  style,
}: DropdownContentProps) {
  const {
    isOpen,
    setPlacement,
    refs,
    floatingStyles,
    strategy,
    getFloatingProps,
  } = useDropdownContext();

  useEffect(() => {
    setPlacement(
      align === "start"
        ? "bottom-start"
        : align === "end"
          ? "bottom-end"
          : "bottom",
    );
  }, [align, setPlacement]);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <div
        {...getFloatingProps({
          ref: refs.setFloating,
          style: {
            ...floatingStyles,
            position: strategy,
            ...style,
            zIndex: 9999,
          },
        })}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 pointer-events-auto rounded-lg",
          className,
        )}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}

type DropdownTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function DropdownTrigger({
  children,
  className,
  type = "button",
  ...props
}: DropdownTriggerProps) {
  const { isOpen, refs, getReferenceProps } = useDropdownContext();
  const referenceProps = getReferenceProps({
    ref: refs.setReference,
    type,
    className,
    "aria-expanded": isOpen,
    "aria-haspopup": "menu",
    ...props,
  });

  return (
    <button {...referenceProps} data-state={isOpen ? "open" : "closed"}>
      {children}
    </button>
  );
}
