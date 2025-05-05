import { CheckCircleIcon, CircleAlertIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
export const toastSuccess = (
  title,
  description = '',
  id = null,
  duration = null,
) => {
  return toast.success(title, {
    id: id,
    description: <span className="text-green-200">{description}</span>,
    icon: <CheckCircleIcon size={20} />,
    style: { backgroundColor: '#4CAF50', color: 'white' },
    duration: duration,
  });
};
export const toastError = (title, description = '', id = null) => {
  return toast.error(title, {
    id: id,
    description: <span className="text-red-200">{description}</span>,
    icon: <XCircleIcon size={20} />,
    style: { backgroundColor: '#ff4d4f', color: 'white' },
  });
};
export const toastInfo = (title, description = '', id = null) => {
  return toast.info(title, {
    id: id,
    description: <span className="text-white">{description}</span>,
    icon: <CircleAlertIcon size={20} />,
    style: { backgroundColor: '#6366f1', color: 'white' },
  });
};
export const toastDismiss = (id = null) => {
  toast.dismiss(id);
};
