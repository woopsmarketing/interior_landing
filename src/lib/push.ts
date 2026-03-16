import webpush from "web-push";
import { supabase } from "./supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushSubscriptionData {
  submissionId: string;
  subscription: webpush.PushSubscription;
  createdAt: string;
  customerName: string;
}

export async function savePushSubscription(
  submissionId: string,
  subscription: webpush.PushSubscription,
  customerName: string
): Promise<void> {
  const { error } = await supabase.from("push_subscriptions").insert({
    submission_id: submissionId,
    subscription,
    customer_name: customerName,
  });

  if (error) throw new Error(`[push] save subscription error: ${error.message}`);
}

export async function sendPushToCustomer(
  submissionId: string,
  payload: { title: string; body: string; url: string }
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { success: false, error: "구독 정보 없음" };
  }

  try {
    await webpush.sendNotification(
      data.subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error(`[push] 발송 실패 (${submissionId}):`, message);
    return { success: false, error: message };
  }
}

export async function hasSubscription(submissionId: string): Promise<boolean> {
  const { count } = await supabase
    .from("push_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("submission_id", submissionId);

  return (count ?? 0) > 0;
}
