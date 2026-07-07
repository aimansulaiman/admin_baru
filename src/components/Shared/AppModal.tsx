type AppModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const AppModal = ({ title, children, onClose }: AppModalProps) => {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-lg font-bold text-dark dark:text-white"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AppModal;