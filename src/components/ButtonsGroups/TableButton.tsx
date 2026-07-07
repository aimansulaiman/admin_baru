import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import React from "react";
import { ButtonGroup } from ".";

export const BUTTONS = [
  { label: "About" },
  { label: "Profile" },
  { label: "Services" },
];

export interface TableButtonProps {
    onPress: () => void
    className: string
    buttonTitle:string
}


const TableButton = ({
    onPress,
    className,
    buttonTitle
}: TableButtonProps) => {
  return (
  <button
              type="button"
              onClick={onPress}
              className={className}
            >
              {buttonTitle}
            </button>
  );
};

export default TableButton;
