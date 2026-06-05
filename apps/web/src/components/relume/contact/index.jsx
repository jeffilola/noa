import React from "react";
import { Footer3 } from "../shared/Footer3";
import { Navbar3 } from "../shared/Navbar3";
import { PageHero } from "../shared/PageHero";
import { Contact14 } from "./components/Contact14";
import { Contact7 } from "./components/Contact7";
import { Cta40 } from "./components/Cta40";
import { Faq13 } from "./components/Faq13";

export default function Page() {
  return (
    <div>
      <Navbar3 />
      <PageHero
        eyebrow="Connect"
        title="Let's talk"
        description="We're ready to answer your questions and discuss how Noa works for your organisation."
        primaryHref="mailto:info@noa.app"
        primaryLabel="Message"
        secondaryHref="/about"
        secondaryLabel="Learn"
      />
      <Contact14 />
      <Contact7 />
      <Cta40 />
      <Faq13 />
      <Footer3 />
    </div>
  );
}
