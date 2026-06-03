import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Rules | VAMOS",
  description: "Padel rules and gameplay on the Padel Hub.",
};

export default function RulesRedirect() {
  redirect("/hub?category=rules");
}
