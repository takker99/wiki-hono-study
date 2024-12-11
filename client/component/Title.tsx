import { LongPress } from "./LongPress.tsx";
import type { FunctionComponent, h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

export interface TitleProps {
  title: string;
  newTitle?: string;
  startTitleEdit: () => void;
  changeTitle: (title: string) => void;
  submitTitle: () => void;
}

export const Title: FunctionComponent<TitleProps> = (
  { title, newTitle, startTitleEdit, changeTitle, submitTitle },
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTitle]);

  const onKeyDown = useCallback(
    (e: h.JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") submitTitle();
    },
    [submitTitle],
  );

  const handleChange = useCallback(
    (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) =>
      changeTitle(e.currentTarget.value),
    [changeTitle],
  );

  const stopPropagation = useCallback(
    (e: Event) => e.stopPropagation(),
    [],
  );

  return !newTitle
    ? (
      <LongPress onLongPress={startTitleEdit}>
        <h1>{title}</h1>
      </LongPress>
    )
    : (
      <h1>
        <input
          ref={inputRef}
          value={newTitle}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onClick={stopPropagation}
        />
      </h1>
    );
};
