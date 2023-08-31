"use client";
import { ReactNode, useContext } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";

type ModalThemeWrapperProps = {
  children?: ReactNode;
};

export const ModalThemeWrapper = (props: ModalThemeWrapperProps) => {
  const { children } = props;
  const { theme } = useContext(ThemeContext);

  return (<div className={`${theme}`}>{children}</div>);
}
