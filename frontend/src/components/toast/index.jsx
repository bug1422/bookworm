import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
export const toastSuccess = (title, description="") => {
  toast.success(title, {
    description: <span className="text-green-200">{description}</span>,
    icon: <CheckCircleIcon size={20} />,
    style: { backgroundColor: "#4CAF50", color: "white" },
  });
};
export const toastError = (title, description="") => {
  toast.error(title, {
    description: <span className="text-red-200">{description}</span>,
    icon: <XCircleIcon size={20} />,
    style: { backgroundColor: "#ff4d4f", color: "white" },
  });
};
