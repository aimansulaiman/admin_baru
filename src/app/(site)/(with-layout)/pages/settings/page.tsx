import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { PersonalInfoForm } from "./_components/personal-info";
import { UploadPhotoForm } from "./_components/upload-photo";

export const metadata: Metadata = {
  title: "Settings Page",
};

export default async function SettingsPage() {
  const user = {
    name: "Demo Admin",
    email: "admin@example.com",
    bio: "This is a dummy admin account while Prisma and Better Auth are disabled.",
    phone: "0123456789",
    image: "/images/user/user-01.png",
  };

  return (
    <div className="mx-auto w-full max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm
            name={user.name}
            email={user.email}
            bio={user.bio}
            phoneNumber={user.phone}
          />
        </div>

        <div className="col-span-5 xl:col-span-2">
          <UploadPhotoForm initialImage={user.image} />
        </div>
      </div>
    </div>
  );
}