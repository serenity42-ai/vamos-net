import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Training | VAMOS",
  description: "Padel training, drills and technique on the Padel Hub.",
};

export default function TrainingRedirect() {
  redirect("/hub?category=training");
}
