import type { FunctionComponent } from "preact";
import type { Store } from "../store.ts";

export const SocketStatus: FunctionComponent<{ connecting: boolean }> = (
  { connecting },
) => {
  const text = connecting ? "connecting" : "disconnected";

  return (
    <div className="socket-status">
      <span className={connecting ? "connect" : "disconnect"}>{text}</span>
    </div>
  );
};
