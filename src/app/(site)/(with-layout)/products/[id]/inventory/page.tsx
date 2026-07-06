import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import ProductInventoryPageContent from "./ProductInventoryPageContent";

export const metadata: Metadata = {
  title: "Stock Management",
};

type ProductInventoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ProductInventoryPage = async ({ params }: ProductInventoryPageProps) => {
  const resolvedParams = await params;

  return (
    <>

      <ProductInventoryPageContent productId={resolvedParams.id} />
    </>
  );
};

export default ProductInventoryPage;