import TrainingPlayground from "@/components/training-playground";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Coding playground",
  "Practice Python, JavaScript, Java, C and C++ with an interactive code editor, small challenges, test results and a collection of your correct solutions.",
  "/playground/",
);

export default function PlaygroundPage() {
  return <TrainingPlayground isNotFound={false} />;
}
