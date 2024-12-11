import { UserIcon } from "./UserIcon.tsx";

export interface User {
  id: number;
  name: string;
}

export interface LoginProps {
  user?: User;
}

export const Login = ({ user }: LoginProps) => (
  <div className="login">
    {!user
      ? (
        <ul>
          <li>
            <span>
              <a href="/auth/login">login</a>
            </span>
          </li>
        </ul>
      )
      : (
        <ul>
          <li>
            <span>
              <a href={"https://github.com/" + user.name}>
                <UserIcon id={user.id} size={20} />
                {user.name}
              </a>
            </span>
          </li>
          <li>
            <span>
              <a href="/auth/logout">logout</a>
            </span>
          </li>
        </ul>
      )}
  </div>
);
