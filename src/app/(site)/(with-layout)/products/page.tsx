import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import ProductPageContent from "./ProductPageContent";

export const metadata: Metadata = {
  title: "Products",
};

const ProductsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Products" />

      <ProductPageContent />
    </>
  );
};

export default ProductsPage;