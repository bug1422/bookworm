import { useAuth } from '../context/useAuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const ProfileDropdown = ({ title, children }) => {
  return (
    <Popover className="relative">
      <PopoverTrigger className="hover:bg-indigo-800 hover:text-white transition p-4 rounded-sm">
        {title}
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default ProfileDropdown;
