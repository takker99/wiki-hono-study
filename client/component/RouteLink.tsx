import type { FunctionComponent } from "preact";
import { buildPath } from "../../share/route.ts";
import { useCallback } from "preact/hooks";

export const RouteLink: FunctionComponent = ({ action, route, children }) => {
  const onClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    action.route(route);
  }, []);
  return <a href={buildPath(route)} onClick={onClick}>{children}</a>;
};
