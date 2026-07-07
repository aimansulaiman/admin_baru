"use client";

const demoUser = {
  id: "demo-user-1",
  name: "Demo Admin",
  email: "admin@example.com",
  image: "/images/user/user-01.png",
  role: "admin",
};

const demoSession = {
  user: demoUser,
  session: {
    id: "demo-session-1",
    token: "demo-token",
  },
};

export const authClient = {
  useSession: () => ({
    data: demoSession,
    isPending: false,
    error: null,
    refetch: async () => demoSession,
  }),

  getSession: async () => ({
    data: demoSession,
    error: null,
  }),

  signIn: {
    email: async () => ({
      data: demoSession,
      error: null,
    }),

    social: async () => ({
      data: demoSession,
      error: null,
    }),
  },

  signUp: {
    email: async () => ({
      data: demoSession,
      error: null,
    }),
  },

  signOut: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_auth");
    }

    return {
      data: true,
      error: null,
    };
  },

  updateUser: async () => ({
    data: demoUser,
    error: null,
  }),

  resetPassword: async () => ({
    data: true,
    error: null,
  }),

  requestPasswordReset: async () => ({
    data: true,
    error: null,
  }),

  emailOtp: {
    verifyEmail: async () => ({
      data: true,
      error: null,
    }),

    sendVerificationOtp: async () => ({
      data: true,
      error: null,
    }),
  },

  admin: {
    stopImpersonating: async () => ({
      data: true,
      error: null,
    }),
  },
};

export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;
export const useSession = authClient.useSession;
export const getSession = authClient.getSession;