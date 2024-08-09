import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/products");
  return null;
}
