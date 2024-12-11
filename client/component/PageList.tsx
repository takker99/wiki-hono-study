// const debug = require('../../share/debug')(__filename)

import { RouteLink } from "./RouteLink.tsx";
import classnames from "classnames";

export interface PageListProps {
  wiki: string;
  name: string;
  title: string;
  pagelist: { title: string; image?: string }[];
  action: object;
}

export function PageList(
  { wiki, name, title, pagelist, action }: PageListProps,
) {
  const list = pagelist.map(({ title: pageTitle, image }) => {
    const style = image
      ? {
        backgroundImage: `url("${image}")`,
      }
      : {};
    const classNames = classnames({
      image,
      selected: pageTitle === title,
    });
    return (
      <li key={pageTitle} className={classNames} style={style}>
        <RouteLink
          action={action}
          route={{ wiki, title: pageTitle }}
        >
          <span>{pageTitle}</span>
        </RouteLink>
      </li>
    );
  });

  return (
    <div className="pagelist">
      <h2>{name}({list.length})</h2>
      <ul>
        {list}
      </ul>
    </div>
  );
}
