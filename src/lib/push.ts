import webpush from "web-push";
import fs from "fs/promises";
import path from "path";

const SUBSCRIPTIONS_DIR = path.join(process.cwd(), "data", "push-subscriptions");

// VAPID 키 설정 — .env.local에서 읽어옴
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

async function ensureDir() {
  await fs.mkdir(SUBSCRIPTIONS_DIR, { recursive: true });
}

// 푸시 구독 저장 (submissionId와 연결)
export async function savePushSubscription(
  submissionId: string,
  subscription: webpush.PushSubscription,
  customerName: string
): Promise<void> {
  await ensureDir();

  const data: PushSubscriptionData = {
    submissionId,
    subscription,
    createdAt: new Date().toISOString(),
    customerName,
  };

  await fs.writeFile(
    path.join(SUBSCRIPTIONS_DIR, `${submissionId}.json`),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// 특정 고객에게 푸시 발송
export async function sendPushToCustomer(
  submissionId: string,
  payload: { title: string; body: string; url: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = await fs.readFile(
      path.join(SUBSCRIPTIONS_DIR, `${submissionId}.json`),
      "utf-8"
    );
    const data: PushSubscriptionData = JSON.parse(raw);

    await webpush.sendNotification(
      data.subscription,
      JSON.stringify(payload)
    );

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error(`[push] 발송 실패 (${submissionId}):`, message);
    return { success: false, error: message };
  }
}

// 구독 존재 여부 확인
export async function hasSubscription(submissionId: string): Promise<boolean> {
  try {
    await fs.access(path.join(SUBSCRIPTIONS_DIR, `${submissionId}.json`));
    return true;
  } catch {
    return false;
  }
}
