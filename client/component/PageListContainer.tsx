import { PageList } from "./PageList.tsx";
import { useEffect, useState } from "preact/hooks";

export function PageListContainer(props) {
  const [state, setState] = useState({
    page: { wiki: "", title: "" },
    pagelist: [],
    relatedPagelist: [],
  });

  useEffect(() => {
    // Fetch data and update state here
  }, []);

  const { wiki, title } = state.page;
  const { pagelist, relatedPagelist } = state;
  if (!wiki || !title) return null;

  return (
    <div>
      {relatedPagelist && relatedPagelist.length > 0 && (
        <PageList
          name="Related"
          wiki={wiki}
          title={title}
          pagelist={relatedPagelist}
          action={props.action}
        />
      )}
      <PageList
        name={wiki}
        wiki={wiki}
        title={title}
        pagelist={pagelist}
        action={props.action}
      />
    </div>
  );
}
