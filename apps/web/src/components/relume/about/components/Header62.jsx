"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import React from "react";

export function Header62() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4">Origins</p>
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
          How NOA began
        </h1>
        <p className="md:text-md">
          We built NOA because the old way was broken. Digital credentials
          scattered across devices, organizations struggling to manage access,
          users losing control of their own identity. There had to be a better
          path.
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          <Link href="/user/credentials">
            <Button title="Explore">Explore</Button>
          </Link>
          <Link href="/security">
            <Button title="Learn" variant="secondary">
              Learn
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
