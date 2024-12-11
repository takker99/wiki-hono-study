import { useCallback, useEffect, useState } from "preact/hooks";
import { FunctionComponent } from "preact";

export interface LongPressProps {
  threshold?: number;
  onLongPress: () => void;
}

export const LongPress: FunctionComponent<LongPressProps> = (
  { children, threshold = 500, onLongPress },
) => {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const start = useCallback(() => {
    stop();
    const id = setTimeout(onLongPress, threshold);
    setTimeoutId(id);
  }, [onLongPress, threshold]);

  const stop = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  useEffect(() => () => {
    if (timeoutId) clearTimeout(timeoutId);
  }, [timeoutId]);

  return (
    <span
      onPointerDown={start}
      onPointerUp={stop}
      onPointerOut={stop}
    >
      {children}
    </span>
  );
};
