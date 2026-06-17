import { Modal } from "@/components/ui/modal";
import { WarningIcon } from "../icons";

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  loading?: boolean;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-h-fit w-full max-w-137.5 rounded-[15px] bg-white px-8 py-12 text-center shadow-3 md:px-15 md:py-15 dark:bg-gray-dark dark:shadow-card"
    >
      <span className="bg-opacity-10 mx-auto flex h-15 w-full max-w-15 items-center justify-center rounded-full bg-[#DC2626] text-white">
        <WarningIcon />
      </span>
      <h3 className="mt-5.5 pb-2 text-xl font-bold text-dark sm:text-2xl dark:text-white">
        {title}
      </h3>
      <p className="mb-10 font-medium">{description}</p>
      <div className="-mx-2.5 flex flex-wrap gap-y-4">
        <div className="w-full px-2.5 2xsm:w-1/2">
          <button
            onClick={onClose}
            className="block w-full cursor-pointer rounded-[7px] border border-stroke bg-gray-2 p-2.75 text-center font-medium text-dark transition hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-4"
          >
            {cancelLabel}
          </button>
        </div>
        <div className="w-full px-3 2xsm:w-1/2">
          <button
            onClick={async () => {
              if (onConfirm) await onConfirm();
            }}
            disabled={loading}
            className="hover:bg-opacity-90 block w-full cursor-pointer rounded-[7px] border border-[#DC2626] bg-[#DC2626] p-2.75 text-center font-medium text-white transition disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
