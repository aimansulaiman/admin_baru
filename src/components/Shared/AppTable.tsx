type AppTableProps = {
  headers: string[];
  children: React.ReactNode;
};

const AppTable = ({ headers, children }: AppTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 font-medium text-dark dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default AppTable;