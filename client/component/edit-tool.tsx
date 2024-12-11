import type { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { Route } from "../../share/route.ts";

export const EditTool: FunctionComponent<{ route: Route }> = ({ route }) => {
  const createNewPage = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const title = globalThis.prompt("create new page");
    if (!title) return;
    // Assuming `action` is available in the context or props
    action.route({ title });
  }, []);

  return (
    <div className="edit-tool">
      <ul>
        <li>
          <span onClick={createNewPage} className="button">
            new page
          </span>
        </li>
        <li>
          <span className="button">
            <a href={`/api/text/${route.wiki}/${route.title}`}>
              text
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
};
