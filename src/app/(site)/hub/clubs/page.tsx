import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Clubs | VAMOS",
  description: "Padel club reviews and openings on the Padel Hub.",
};

export default function ClubsRedirect() {
  redirect("/hub?category=clubs");
}
