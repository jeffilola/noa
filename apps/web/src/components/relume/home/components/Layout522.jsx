"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

const tiles = [
  {
    span: "sm:col-span-2",
    label: "Enterprise",
    title:
      "Streamline credential management across departments and reduce security overhead.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
    alt: "Modern corporate towers representing enterprise-scale access management",
    links: [
      { label: "More", variant: "secondary-alt" },
      { label: "Security teams", variant: "link" },
    ],
    large: true,
  },
  {
    label: null,
    title: "Audit logs and device controls give you complete visibility.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    alt: "Hotel lobby where digital keys replace physical cards",
    links: [{ label: "Hotels, gyms, and events", variant: "link" }],
    large: false,
  },
  {
    label: null,
    title: "Issue digital passes and manage access with confidence.",
    image: '/marketing/digital-pass-access.png',
    alt: "Person presenting a phone for contactless access at a reader",
    links: [{ label: "Issuers and admins", variant: "link" }],
    large: false,
  },
];

function TileBackground({ image, alt }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
      <img src={image} className="size-full object-cover" alt={alt} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35" />
    </div>
  );
}

export function Layout522() {
  return (
    <section id="solutions" className="marketing-section px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Solutions</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Built for your industry
            </h2>
            <p className="md:text-md">
              Whether you manage access or hold credentials, NOA works for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className={`relative overflow-hidden rounded-2xl p-6 md:p-8 ${tile.span ?? ""} ${tile.large ? "lg:p-12" : "lg:p-6"}`}
            >
              <TileBackground image={tile.image} alt={tile.alt} />

              <div className="relative z-10 flex min-h-[280px] flex-col justify-end sm:min-h-[320px]">
                {tile.label ? (
                  <p className="mb-2 inline-block text-sm font-semibold text-text-alternative">
                    {tile.label}
                  </p>
                ) : null}

                <h3
                  className={`mb-5 font-bold leading-[1.2] text-text-alternative md:mb-6 ${
                    tile.large ? "text-4xl md:text-5xl lg:text-6xl" : "text-xl md:text-2xl"
                  }`}
                >
                  {tile.title}
                </h3>

                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  {tile.links.map((link) =>
                    link.variant === "secondary-alt" ? (
                      <Button key={link.label} variant="secondary-alt">
                        {link.label}
                      </Button>
                    ) : (
                      <Button
                        key={link.label}
                        iconRight={<RxChevronRight />}
                        variant="link-alt"
                        size="link"
                      >
                        {link.label}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
