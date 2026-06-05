import React from "react";
import { Footer3 } from "../shared/Footer3";
import { Navbar3 } from "../shared/Navbar3";
import { PageHero } from "../shared/PageHero";
import { Faq13 } from "./components/Faq13";
import { Layout19 } from "./components/Layout19";
import { Layout22 } from "./components/Layout22";
import { Layout22_1 } from "./components/Layout22_1";
import { Layout31 } from "./components/Layout31";
import { Stats24 } from "./components/Stats24";
import { Testimonial3 } from "./components/Testimonial3";

export default function Page() {
  return (
    <div>
      <Navbar3 />
      <PageHero
        eyebrow="Protected"
        title="Enterprise-grade security"
        description="Your credentials deserve protection built for the most demanding security teams."
        primaryHref="/user/credentials"
        primaryLabel="Explore"
        secondaryHref="/contact"
        secondaryLabel="Contact"
      />
      <Layout22 />
      <Layout22_1 />
      <Layout19 />
      <Layout31 />
      <Stats24 />
      <Testimonial3 />
      <Faq13 />
      <Footer3 />
    </div>
  );
}
