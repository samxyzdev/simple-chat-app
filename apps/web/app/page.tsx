import LandingPage from "../components/LandingPage";
import { WhatsAppLogoIcon } from "../icons/WhatsAppLogoIcon";
import { WhatsAppNameLogoIcon } from "../icons/WhatsAppNameLogoIcon";

export default function Home() {
  return (
    <main>
      <section className="min-h-screen w-full bg-[#FCF5EB]">
        <h1 className="flex items-center gap-1 px-10 py-2 text-[#25D366]">
          <WhatsAppLogoIcon />
          <WhatsAppNameLogoIcon />
        </h1>
        <div className="mx-auto mt-36 max-w-md">
          <div className="rounded-lg border bg-white p-6 shadow-md">
            <LandingPage />
          </div>
        </div>
      </section>
    </main>
  );
}
