// src/hooks/useAdvancedToggle.ts
import { useState } from "react";

const useAdvancedToggle = <T>(states: T[]) => {
  const [index, setIndex] = useState(0);

  const toggle = () => {
    setIndex((prevIndex) => (prevIndex + 1) % states.length);
  };

  return [states[index], toggle] as const;
};

export default useAdvancedToggle;
