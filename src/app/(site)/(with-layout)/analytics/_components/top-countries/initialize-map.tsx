"use client";

import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world";
import { useEffect } from "react";

export default function initializeVectorMap() {
  useEffect(() => {
    const element = document.querySelector("#mapTwo");

    if (!element) {
      return;
    }

    const map = new jsVectorMap({
      selector: "#mapTwo",
      map: "world",
      zoomButtons: true,
      regionStyle: {
        initial: {
          fill: "#A9BDFF",
        },
        hover: {
          fillOpacity: 1,
          fill: "#3056D3",
        },
      },
    });

    return () => {
      map.destroy?.();
    };
  }, []);

  return null;
}
