type AppMessageProps = {
  message: string;
};

const AppMessage = ({ message }: AppMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
      {message}
    </div>
  );
};

export default AppMessage;