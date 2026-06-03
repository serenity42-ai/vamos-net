import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel Reviews | VAMOS",
  description: "Padel equipment reviews on the Padel Hub.",
};

export default function ReviewsRedirect() {
  redirect("/hub?category=reviews");
}
