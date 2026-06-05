"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout19() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Privacy</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Your rights built into the platform
            </h2>
            <p className="mb-5 md:mb-6 md:text-md">
              GDPR compliance runs through every layer of NOA. Data deletion,
              consent management, and privacy controls are native to the system,
              not bolted on afterwards. You own your information completely.
            </p>
            <ul className="my-4 list-disc pl-5">
              <li className="my-1 self-start pl-2">
                <p>Delete your data anytime</p>
              </li>
              <li className="my-1 self-start pl-2">
                <p>Control consent for each organisation</p>
              </li>
              <li className="my-1 self-start pl-2">
                <p>Export credentials in standard formats</p>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Learn" variant="secondary">
                Learn
              </Button>
              <Button
                title="Read"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
              >
                Read
              </Button>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
