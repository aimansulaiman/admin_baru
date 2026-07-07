"use client";

import { customerApi } from "@/app/api/rtk/customerApi";
import { orderApi } from "@/app/api/rtk/orderApi";
import { productApi } from "@/app/api/rtk/productApi";
import { storeApi } from "@/app/api/rtk/storeApi";
import { userApi } from "@/app/api/rtk/userApi";
import { cable } from "@/lib/cable";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type ApiUpdateMessage = {
  resource?: string;
  action?: string;
  event?: string;
  id?: number;
  timestamp?: string;
};

export default function RealtimeApiListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = cable.subscriptions.create("ApiUpdatesChannel", {
      connected() {
        console.log("Connected to realtime API updates.");
      },

      disconnected() {
        console.log("Disconnected from realtime API updates.");
      },

      received(data: ApiUpdateMessage) {
        console.log("Realtime API update:", data);

        switch (data.resource) {
          case "orders":
            dispatch(orderApi.util.invalidateTags(["Orders"]));
            break;

          case "products":
            dispatch(productApi.util.invalidateTags(["Products"]));
            break;

          case "stores":
            dispatch(storeApi.util.invalidateTags(["Stores"]));
            break;

          case "customers":
            dispatch(customerApi.util.invalidateTags(["Customers"]));
            break;

          case "users":
            dispatch(userApi.util.invalidateTags(["Users"]));
            break;

          default:
            console.log("No realtime handler for:", data.resource);
            break;
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}