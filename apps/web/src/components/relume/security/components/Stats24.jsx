"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoIframe,
} from "@relume_io/relume-ui";
import React from "react";
import { FaCirclePlay } from "react-icons/fa6";

export function Stats24() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex flex-col items-start">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Certified</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Built to the standards that matter
          </h1>
          <p className="md:text-md">
            NOA holds SOC 2 Type II certification and ISO 27001 compliance.
            Independent penetration testing confirms our security posture. We
            maintain 99.99% uptime across all regions.
          </p>
        </div>
        <Tabs
          defaultValue="tab-1"
          className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20"
        >
          <TabsList className="col-start-1 col-end-2 row-start-1 row-end-2 grid grid-cols-1 items-center gap-x-4 gap-y-10">
            <TabsTrigger
              value="tab-1"
              className="flex-col items-start justify-start whitespace-normal border-0 border-l-2 border-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h2 className="mb-2 text-6xl font-bold md:text-9xl lg:text-10xl">
                99.99%
              </h2>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Uptime guarantee
              </h3>
              <p className="mt-2">Across all regions, every day</p>
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="flex-col items-start justify-start whitespace-normal border-0 border-l-2 border-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h2 className="mb-2 text-6xl font-bold md:text-9xl lg:text-10xl">
                99.99%
              </h2>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Uptime guarantee
              </h3>
              <p className="mt-2">Across all regions, every day</p>
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="flex-col items-start justify-start whitespace-normal border-0 border-l-2 border-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h2 className="mb-2 text-6xl font-bold md:text-9xl lg:text-10xl">
                99.99%
              </h2>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Uptime guarantee
              </h3>
              <p className="mt-2">Across all regions, every day</p>
            </TabsTrigger>
          </TabsList>
          <div className="max-size-full flex items-center justify-center overflow-hidden">
            <TabsContent
              value="tab-1"
              className="data-[state=active]:animate-tabs"
            >
              <div className="relative size-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="size-full object-cover"
                />
              </div>
            </TabsContent>
            <TabsContent
              value="tab-2"
              className="data-[state=active]:animate-tabs"
            >
              <div className="relative size-full">
                <Dialog>
                  <DialogTrigger className="relative flex w-full items-center justify-center">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                      alt="Relume placeholder image 2"
                      className="size-full object-cover"
                    />
                    <span className="absolute inset-0 z-10 bg-black/50" />
                    <FaCirclePlay className="absolute z-20 size-16 text-white" />
                  </DialogTrigger>
                  <DialogContent>
                    <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            <TabsContent
              value="tab-3"
              className="data-[state=active]:animate-tabs"
            >
              <div className="relative size-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 3"
                  className="size-full object-cover"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
