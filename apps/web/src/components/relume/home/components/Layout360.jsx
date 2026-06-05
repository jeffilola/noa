"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout360() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Capabilities</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Everything you need to manage identity
            </h2>
            <p className="md:text-md">
              NOA combines credential management, organization control, and
              security auditing into one platform. Built for enterprises that
              demand precision and trust.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="border border-border-primary">
            <div className="p-6 md:p-8 lg:p-12">
              <p className="mb-2 text-sm font-semibold">Tagline</p>
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Single identity
              </h3>
              <p>
                Administrators control issuance, revocation, and access across
                multiple organizations effortlessly.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Explore" variant="secondary">
                  Explore
                </Button>
                <Button
                  title="More"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/marketing/single-identity.png"
                className="size-full max-h-72 object-cover"
                alt="Unified identity dashboard connecting multiple organizations"
                loading="lazy"
              />
            </div>
          </div>
          <div className="border border-border-primary">
            <div className="p-6 md:p-8 lg:p-12">
              <p className="mb-2 text-sm font-semibold">Tagline</p>
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Credential wallet
              </h3>
              <p>
                GDPR controls and device management keep your data protected and
                compliant.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Button" variant="secondary">
                  Button
                </Button>
                <Button
                  title="Button"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Button
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/marketing/credential-wallet.png"
                className="size-full max-h-72 object-cover"
                alt="Smartphone wallet showing secure digital access passes"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
