import React from "react";
import { Avatar } from "antd";
interface AvatarProps {
  user: User;
  [x: string]: any;
}

export const AvatarCus = ({ user, ...rest }: AvatarProps) => {
  if (user?.avatar)
    return (
      <Avatar
        className={`w-6 h-6 flex items-center justify-center text-xs ${rest}`}
        src={user?.avatar}
      ></Avatar>
    );
  return <Avatar className={`${rest}`}>{user?.name?.charAt(0)}</Avatar>;
};
