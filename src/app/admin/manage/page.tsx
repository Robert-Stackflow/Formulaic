"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/loading";
import { PageLayout } from "@/components/page-layout";
import { usePermissions } from "@/hooks/use-permissions";
import { UnderlinedTab } from "@/components/underlined-tab";
import { UserManagement } from "./user-management";
import { SensitiveWordsManagement } from "./sensitive-words-management";
import { DiscussionTagsManagement } from "./discussion-tags-management";
import { User, DiscussionTag, SensitiveWord } from "@/types/admin";

type AdminTab = "users" | "words" | "tags";

const tabs = [
  { key: "users", title: "用户管理" },
  { key: "words", title: "敏感词管理" },
  { key: "tags", title: "主题标签管理" },
];

export default function AdminPage() {
  const { session, isAdmin } = usePermissions();
  const { status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [sensitiveWords, setSensitiveWords] = useState<SensitiveWord[]>([]);
  const [discussionTags, setDiscussionTags] = useState<DiscussionTag[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  // 只需要一个统一的加载函数
  const loadData = async () => {
    try {
      const [usersRes, wordsRes, tagsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/sensitive-words"),
        fetch("/api/admin/discussion-tags"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
      } else if (usersRes.status === 403) {
        router.push("/");
        alert("需要管理员权限");
        return;
      }

      if (wordsRes.ok) {
        const data = await wordsRes.json();
        setSensitiveWords(data.words);
      }

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setDiscussionTags(data.tags);
      }
    } catch (error) {
      console.error("Load admin data error:", error);
    }
  };

  if (status === "loading") {
    return <LoadingPage message="加载管理面板..." />;
  }

  return (
    <PageLayout maxWidth="2xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 font-bold text-fd-foreground">
          管理员面板
        </h1>
        <p className="text-fd-muted-foreground">仅管理员可见的管理功能</p>
      </div>

      {/* Tabs - 使用新的 UnderlinedTab 组件 */}
      <UnderlinedTab
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as AdminTab)}
      />

      {/* 渲染对应 Tab 的内容组件 */}
      {activeTab === "users" && (
        <UserManagement users={users} loadData={loadData} />
      )}

      {activeTab === "words" && (
        <SensitiveWordsManagement
          sensitiveWords={sensitiveWords}
          loadData={loadData}
        />
      )}

      {activeTab === "tags" && (
        <DiscussionTagsManagement
          discussionTags={discussionTags}
          loadData={loadData}
        />
      )}
    </PageLayout>
  );
}
