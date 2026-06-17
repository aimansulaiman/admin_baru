import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import QuitImpersonation from "@/components/QuitImpersonation";
import Spinner from "@/components/spinner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense, type PropsWithChildren } from "react";
import ToastContext from "../../context/ToastContext";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(
      `/auth/sign-in?callbackUrl=/&message=${encodeURIComponent(
        "Please sign in to continue",
      )}`,
    );
  }

  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
            <Header />

            <main className="relative mx-auto w-full max-w-(--breakpoint-2xl) overflow-hidden p-4 md:p-6 2xl:p-10">
              <Suspense fallback={<Spinner />}>{children}</Suspense>
            </main>
          </div>

          <QuitImpersonation />
        </div>
      </SidebarProvider>

      <ToastContext />
    </>
  );
}
