import type { ReactNode } from "react";

type CustomerStyleTableProps = {
  children: ReactNode;
  minWidth?: string;
};

const CustomerStyleTable = ({
  children,
  minWidth = "1000px",
}: CustomerStyleTableProps) => {
  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full table-auto" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </div>
  );
};

export default CustomerStyleTable;