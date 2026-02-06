import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};
