import { createConsumer } from "@rails/actioncable";

const cableUrl =
  process.env.NEXT_PUBLIC_ACTION_CABLE_URL || "ws://localhost:3000/cable";

export const cable = createConsumer(cableUrl);