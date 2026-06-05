"use client";

import React from "react";

export function Testimonial3() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            What users say
          </h1>
          <p className="md:text-md">
            Trusted by enterprises and security teams worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12 lg:gap-y-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                alt="Webflow logo"
                className="max-h-14"
              />
            </div>
            <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
              "NOA simplified our credential management overnight. We went from
              managing dozens of systems to one unified platform. The audit logs
              alone save us hours every week."
            </blockquote>
            <div className="mt-6 flex flex-col items-center justify-center md:mt-8">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial avatar"
                  className="size-14 min-h-14 min-w-14 rounded-full object-cover"
                />
              </div>
              <p className="font-semibold">Sarah Mitchell</p>
              <p>Security director, enterprise</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                alt="Webflow logo"
                className="max-h-14"
              />
            </div>
            <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
              "Our guests love the simplicity. Digital passes in their wallet,
              instant revocation if needed, and we have complete visibility.
              It's exactly what we needed."
            </blockquote>
            <div className="mt-6 flex flex-col items-center justify-center md:mt-8">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial avatar"
                  className="size-14 min-h-14 min-w-14 rounded-full object-cover"
                />
              </div>
              <p className="font-semibold">James Chen</p>
              <p>Operations manager, hotel</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                alt="Webflow logo"
                className="max-h-14"
              />
            </div>
            <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
              "The device management features give us peace of mind. We know
              exactly who has access and from where. That's the kind of control
              we demand."
            </blockquote>
            <div className="mt-6 flex flex-col items-center justify-center md:mt-8">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial avatar"
                  className="size-14 min-h-14 min-w-14 rounded-full object-cover"
                />
              </div>
              <p className="font-semibold">Rachel Torres</p>
              <p>Chief security officer, enterprise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
