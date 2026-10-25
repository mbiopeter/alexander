import type { Metadata } from "next";
import TrainingPlayground from "@/components/training-playground";

export const metadata: Metadata = {
  title: "404 — Coding playground | Mbiopeter",
  description:
    "This page could not be found. Head back home or practice Python, JavaScript, Java, C and C++ in Mbiopeter’s coding playground.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <TrainingPlayground isNotFound />;
}
