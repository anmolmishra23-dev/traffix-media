"use client";

import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Badge, Button, Card, Flash, Loading, PageHeader } from "@/components/admin/ui";
import { deleteRow, saveRow } from "@/lib/admin-api";
import type { Enquiry } from "@/lib/types";
import { telUrl, whatsappUrl } from "@/lib/utils";

export default function EnquiriesAdmin() {
  const { db, refreshUnread } = useAdmin();
  const { pending, flash, run } = useTask();
  const { data: enquiries, reload } = useLoad(async () => {
    const { data } = await db.from("enquiries").select("*").order("created_at", { ascending: false });
    return (data as Enquiry[]) ?? [];
  });

  const toggle = (e: Enquiry) =>
    run(async () => {
      await saveRow(db, "enquiries", e.id, { is_read: !e.is_read });
      reload();
      refreshUnread();
    });

  const remove = (e: Enquiry) => {
    if (!window.confirm(`Delete enquiry from ${e.name}?`)) return;
    run(async () => {
      await deleteRow(db, "enquiries", e.id);
      reload();
      refreshUnread();
      return "Enquiry deleted.";
    });
  };

  return (
    <>
      <PageHeader title="Enquiries" description="Messages sent from the website's contact form." />
      <Flash ok={flash.ok} error={flash.error} />

      {!enquiries ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <Card key={e.id} className={e.is_read ? "" : "border-[#6a1a23]/30 ring-1 ring-[#6a1a23]/10"}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {e.name} {!e.is_read && <Badge tone="maroon">New</Badge>}
                  </p>
                  <p className="text-sm text-zinc-500">{[e.company, e.service, e.budget].filter(Boolean).join(" · ") || "—"}</p>
                </div>
                <time className="text-xs text-zinc-400" dateTime={e.created_at}>
                  {new Date(e.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>

              <p className="mt-4 text-sm whitespace-pre-wrap text-zinc-800">{e.message}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={`mailto:${e.email}`} className="font-medium text-[#6a1a23] hover:underline">
                  {e.email}
                </a>
                {e.phone && (
                  <>
                    <a href={telUrl(e.phone) ?? "#"} className="font-medium text-[#6a1a23] hover:underline">
                      {e.phone}
                    </a>
                    <a href={whatsappUrl(e.phone) ?? "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700 hover:underline">
                      WhatsApp
                    </a>
                  </>
                )}
              </div>

              <div className="mt-5 flex gap-2 border-t border-zinc-100 pt-4">
                <Button type="button" variant="secondary" pending={pending} pendingText="…" onClick={() => toggle(e)}>
                  {e.is_read ? "Mark as unread" : "Mark as read"}
                </Button>
                <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove(e)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
          {!enquiries.length && (
            <Card className="text-center text-sm text-zinc-500">No enquiries yet. They&apos;ll appear here when someone uses the contact form.</Card>
          )}
        </div>
      )}
    </>
  );
}
