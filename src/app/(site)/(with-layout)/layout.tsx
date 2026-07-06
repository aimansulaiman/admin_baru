import AuthGuard from "@/components/AuthGuard";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import Spinner from "@/components/spinner";
import { Suspense, type PropsWithChildren } from "react";
import ToastContext from "../../context/ToastContext";
import RealtimeApiListener from "@/components/RealtimeApiListener";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <>
    <RealtimeApiListener />
      <AuthGuard>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="relative mx-auto w-full max-w-(--breakpoint-2xl) overflow-hidden p-4 md:p-6 2xl:p-10">
                <Suspense fallback={<Spinner />}>{children}</Suspense>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthGuard>

      <ToastContext />
    </>
  );
}