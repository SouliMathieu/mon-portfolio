import AboutBio from "@/components/sections/AboutBio";
import HighlightsCarousel from "@/components/sections/HighlightsCarousel";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactForm from "@/components/sections/ContactForm";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen px-8 md:px-16 lg:px-24 py-24">
      <AboutBio />
      <HighlightsCarousel />
      <div className="max-w-5xl mx-auto mt-16 flex flex-col lg:flex-row gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </main>
  );
}