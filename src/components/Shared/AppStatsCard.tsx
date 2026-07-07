type AppStatsCardProps = {
  title: string;
  value: string | number | null | undefined;
};

const AppStatsCard = ({ title, value }: AppStatsCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {value || 0}
      </h3>
    </div>
  );
};

export default AppStatsCard;