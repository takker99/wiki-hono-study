import type { FunctionalComponent } from "preact";

export interface UserIconProps {
  id: number;
  size?: number;
}

export const UserIcon: FunctionalComponent<UserIconProps> = (
  { id, size = 20 },
) => (
  <img
    className="usericon"
    src={`https://avatars.githubusercontent.com/u/${id}?v=3&s=${size}`}
    width={size}
    height={size}
  />
);
