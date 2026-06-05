import React from "react";
import { Footer3 } from "../shared/Footer3";
import { Navbar3 } from "../shared/Navbar3";
import { PageHero } from "../shared/PageHero";
import { Faq13 } from "./components/Faq13";
import { Logo6 } from "./components/Logo6";
import { Stats13 } from "./components/Stats13";
import { Team2 } from "./components/Team2";

export default function Page() {
  return (
    <div>
      <Navbar3 />
      <PageHero
        eyebrow="Origins"
        title="How Noa began"
        description="We built Noa because the old way was broken. Credentials scattered across devices, organizations struggling to manage access, and users losing control of their own identity."
        primaryHref="/user/credentials"
        primaryLabel="Explore"
        secondaryHref="/security"
        secondaryLabel="Learn"
      />
      <Stats13 />
      <Team2 />
      <Logo6 />
      <Faq13 />
      <Footer3 />
    </div>
  );
}
