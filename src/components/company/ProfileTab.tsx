"use client";

import { useState } from "react";
import { CompanyProfile } from "@/lib/types";
import ProfileView from "./ProfileView";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileTab({
  profile,
  onSave,
}: {
  profile: CompanyProfile;
  onSave: () => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileEditForm
        profile={profile}
        onSave={() => { setEditing(false); onSave(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          프로필 수정
        </button>
      </div>
      <ProfileView profile={profile} />
    </div>
  );
}
