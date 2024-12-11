import type { FunctionComponent } from "preact";
import { format } from "@std/datetime";

export const PageDate: FunctionComponent<{
  createdAt?: Date;
  updatedAt?: Date;
}> = ({
  createdAt,
  updatedAt,
}) => {
  if (!createdAt || !updatedAt) return null;
  const createdAtStr = format(createdAt, "YYYY/MM/DD");
  const updatedAtStr = format(updatedAt, "YYYY/MM/DD");
  const dateStr = createdAtStr === updatedAtStr
    ? createdAtStr
    : `${createdAtStr}〜${updatedAtStr}`;
  return <div className="page-date">{`(${dateStr})`}</div>;
};
