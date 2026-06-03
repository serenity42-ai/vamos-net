import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Lifestyle | VAMOS",
  description: "Padel lifestyle coverage on the Padel Hub.",
};

export default function LifestyleRedirect() {
  redirect("/hub?category=lifestyle");
}
