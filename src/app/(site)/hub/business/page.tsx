import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Business | VAMOS",
  description: "Padel business coverage on the Padel Hub.",
};

export default function BusinessRedirect() {
  redirect("/hub?category=business");
}
