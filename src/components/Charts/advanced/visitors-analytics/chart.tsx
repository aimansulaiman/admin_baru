"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type PropsType = {
  data: { x: string; y: number }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function VisitorsAnalyticsChart({ data }: PropsType) {
  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#5750F1"],
      chart: {
        fontFamily: "inherit",
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: 0,
          style: {
            fontSize: "14px",
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            xaxis: {
              tickAmount: 4,
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            xaxis: {
              tickAmount: 6,
            },
          },
        },
      ],
      grid: {
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          show: false,
        },
      },
    }),
    [data.length],
  );

  return (
    <div className="mt-7 -mr-2.5 -ml-4 h-87.5">
      <Chart
        options={options}
        series={[
          {
            name: "Visitors",
            data,
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}
