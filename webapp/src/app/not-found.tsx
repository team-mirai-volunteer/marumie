import "server-only";
import { redirect } from "next/navigation";

export default function NotFound() {
  // 遷移先で適切なslugを取得できるのでここではdummy_valueで固定
  redirect("/o/dummy_value");
}
