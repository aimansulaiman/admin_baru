import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Card } from "@/components/ui-elements/card";

import { Metadata } from "next";
import { useId } from "react";

export const metadata: Metadata = {
  title: "Cards",
};

export default function Page() {
  const DATA = getCardData();

  return (
    <>
      <Breadcrumb pageName="Cards" />

      <h2 className="mt-9 mb-6 text-[22px] leading-7.5 font-bold text-dark dark:text-white">
        Cards Style 1
      </h2>

      <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        {DATA.map((data) => (
          <Card key={data.content + data.coverImage} data={data} />
        ))}
      </div>

      <h2 className="mt-9 mb-6 text-[22px] leading-7.5 font-bold text-dark dark:text-white">
        Cards Style 2
      </h2>

      <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        {DATA.map((data) => (
          <Card
            key={useId()}
            data={{
              ...data,
              author: undefined,
            }}
          />
        ))}
      </div>

      <h2 className="mt-9 mb-6 text-[22px] leading-7.5 font-bold text-dark dark:text-white">
        Cards Style 3
      </h2>

      <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        {DATA.map((data) => (
          <Card
            key={useId()}
            data={{
              ...data,
              author: undefined,
              coverImage: undefined,
            }}
          />
        ))}
      </div>
    </>
  );
}

function getCardData() {
  return [
    {
      author: {
        name: "Naimur Rahman",
        role: "Content Writer",
        profileImage: "/images/user/user-25.png",
      },
      title: "Card Title here",
      coverImage: "/images/cards/cards-01.png",
      content:
        "Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque lnterdum et.",
    },
    {
      author: {
        name: "Musharof Chy",
        role: "Web Developer",
        profileImage: "/images/user/user-26.png",
      },
      title: "Card Title here",
      coverImage: "/images/cards/cards-02.png",
      content:
        "Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque lnterdum et.",
    },
    {
      author: {
        name: "Shafiq Hammad",
        role: "Frontend Developer",
        profileImage: "/images/user/user-30.png",
      },
      title: "Card Title here",
      coverImage: "/images/cards/cards-03.png",
      content:
        "Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque lnterdum et.",
    },
  ];
}
