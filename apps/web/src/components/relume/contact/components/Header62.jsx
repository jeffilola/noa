"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import React from "react";

export function Header62() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4">Connect</p>
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
          Let's talk
        </h1>
        <p className="md:text-md">
          We're ready to answer your questions and discuss how NOA works for
          your organisation
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          <Link href="mailto:info@noa.app">
            <Button title="Message">Message</Button>
          </Link>
          <Link href="/about">
            <Button title="Learn" variant="secondary">
              Learn
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
