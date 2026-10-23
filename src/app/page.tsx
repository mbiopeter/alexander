import { HomePage } from "@/components/home-page";
import { makeMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = makeMetadata(
  "Alexender: Developer",
  siteConfig.description,
  "/",
);

export default function Page() {
  return <HomePage />;
}
