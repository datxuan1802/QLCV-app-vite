import { Avatar } from "antd";
interface AvatarProps {
  user: User;
  tailwind?: string;
  [x: string]: any;
}

export const AvatarCus = ({ user, tailwind, ...rest }: AvatarProps) => {
  if (user?.avatar)
    return (
      <Avatar
        className={`w-6 h-6 flex bg-blue-200 items-center justify-center text-xs ${tailwind}`}
        src={user?.avatar}
      ></Avatar>
    );
  return (
    <Avatar className={`${tailwind} bg-blue-400`}>
      {user?.name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};
