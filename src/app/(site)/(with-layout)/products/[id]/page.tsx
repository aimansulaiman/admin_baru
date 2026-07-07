import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import ProductInfoPageContent from "./ProductInfoPageContent";

export const metadata: Metadata = {
  title: "Product Info",
};

type ProductInfoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ProductInfoPage = async ({ params }: ProductInfoPageProps) => {
  const resolvedParams = await params;

  return (
    <>
      

      <ProductInfoPageContent productId={resolvedParams.id} />
    </>
  );
};

export default ProductInfoPage;