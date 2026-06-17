import { GoogleIcon } from "@/assets/icons/social";
import { authClient } from "@/lib/auth/auth-client";

export default function GoogleSigninButton({
  text,
  callbackURL = "/",
  loading,
  setLoading,
}: {
  text: string;
  callbackURL?: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  async function handleGoogleSignIn() {
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: `/auth/sign-in?message=${encodeURIComponent("Failed to sign in with Google")}`,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // do nothing
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="hover:bg-opacity-50 dark:hover:bg-opacity-50 flex w-full cursor-pointer items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray-2 p-3.75 font-medium dark:border-dark-3 dark:bg-dark-2"
    >
      <GoogleIcon />
      {text} with Google
    </button>
  );
}
