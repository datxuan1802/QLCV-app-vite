import { Avatar } from "antd";
interface AvatarProps {
  user: User;
  [x: string]: any;
}

export const AvatarCus = ({ user, ...rest }: AvatarProps) => {
  if (user?.avatar)
    return (
      <Avatar
        className={`w-6 h-6 flex bg-blue-200 items-center justify-center text-xs ${rest}`}
        src={user?.avatar}
      ></Avatar>
    );
  return (
    <Avatar className={`${rest} bg-blue-400`}>
      {user?.name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};
