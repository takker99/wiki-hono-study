export interface Route {
  wiki: Wiki;
  title?: Title;
}

export function buildPath(
  { wiki, title }: Route,
): `/${Wiki}/${Title}` | `/${Wiki}` {
  if (wiki && title) return `/${wiki}/${title}`;
  return `/${wiki}`;
}

export const parseRoute = (
  path?: `/${string}/${string}` | `/${string}`,
): Route => {
  const [wiki, ...titleParts] = decodeURIComponent(path ?? currentPathname())
    .slice(1).split("/");
  const title = titleParts.join("/");
  if (!title) return { wiki: validateWiki(wiki) };
  return { wiki: validateWiki(wiki), title: validateTitle(title) };
};

const currentPathname = () => {
  const pathname = location.pathname;
  if (pathname.startsWith("/")) {
    throw new Error("pathname should start with '/'");
  }
  return pathname as `/${string}`;
};

const blacklist = ["auth", "login", "logout", "config", "api", "slide"];

declare const tag: unique symbol;
export type Branded<T, Tag> = T & { [tag]: Tag };
export type Name = Branded<string, "Name">;

/** common rules for wiki & title */
export function validateName(name: string): Name {
  if (name.length < 1) throw new Error("name is empty");

  if (name.length > 64) throw new Error("name is too long");

  if (blacklist.includes(name.toLowerCase())) {
    throw new Error(`"${name}" is reserved for system`);
  }

  if (name.trim() !== name) {
    throw new Error("name cannot have space at head or tail");
  }

  for (const c of "#\n\r") {
    if (name.includes(c)) throw new Error(`name cannot contain "${c}"`);
  }

  if (name.includes("::")) throw new Error(`name cannot contain "::"`);

  if (decodeURIComponent(name) !== name) {
    throw new Error("name cannot contain URI encoded char");
  }

  return name as Name;
}

export type Title = Branded<string, "Title">;
/** validate page name */
export const validateTitle = (name: string): Title =>
  validateName(name) as string as Title;

export type Wiki = Branded<string, "Wiki">;
/** validate wiki name */
export function validateWiki(name: string): Wiki {
  const result = validateName(name);
  if (result.startsWith("/")) throw new Error("wiki cannot start with '/'");

  for (const c of "/:") {
    if (name.includes(c)) throw new Error(`wiki cannot contain "${c}"`);
  }

  return result as string as Wiki;
}

export const defaultRoute: Route = /*#__PURE__*/ {
  wiki: validateWiki("general"),
  title: validateTitle("hello"),
};
