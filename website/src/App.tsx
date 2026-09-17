import { onMount } from "solid-js";

import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import InfoUtili from "@/sections/InfoUtili";
import Program from "@/sections/Program";
import Rsvp from "@/sections/Rsvp";

function App() {
  onMount(() => {
    (window as unknown as Record<string, unknown>)["__appReady"] = true;
  });
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Program />
        <InfoUtili />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}

export default App;
