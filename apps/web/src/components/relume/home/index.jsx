import React from "react";
import { Navbar3 } from "../shared/Navbar3";
import { Header84 } from "./components/Header84";
import { Layout360 } from "./components/Layout360";
import { Layout522 } from "./components/Layout522";
import { Layout356 } from "./components/Layout356";
import { Stats31 } from "./components/Stats31";
import { Testimonial3 } from "./components/Testimonial3";
import { Cta40 } from "./components/Cta40";
import { Faq13 } from "./components/Faq13";
import { Footer3 } from "../shared/Footer3";

export default function Page() {
  return (
    <div>
      <Navbar3 />
      <Header84 />
      <Layout360 />
      <Layout522 />
      <Layout356 />
      <Stats31 />
      <Testimonial3 />
      <Cta40 />
      <Faq13 />
      <Footer3 />
    </div>
  );
}
