"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  addGuestAction,
  bulkImportGuestsAction,
  deleteGuestAction,
  exportGuestsCsv,
} from "@/lib/guest-management-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface GuestData {
  id: string;
  name: string;
  phone: string | null;
  token: string;
  viewCount: number;
  createdAt: string;
  rsvp: {
    status: string;
    guestCount: number;
    message: string | null;
    respondedAt: string | null;
  } | null;
}

interface Analytics {
  totalInvited: number;
  totalViews: number;
  totalGuestCount: number;
  conversionRate: number;
  rsvp: {
    confirmed: number;
    declined: number;
    maybe: number;
    pending: number;
  };
}

interface Props {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  guests: GuestData[];
  analytics: Analytics | null;
  appUrl: string;
  locale: string;
}

type FilterStatus = "all" | "confirmed" | "declined" | "maybe" | "pending";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  CONFIRMED: "default",
  DECLINED: "destructive",
  MAYBE: "secondary",
  PENDING: "outline",
};

export function GuestListClient({
  eventId,
  eventSlug,
  eventTitle,
  guests: initialGuests,
  analytics,
  appUrl,
  locale,
}: Props) {
  const t = useTranslations("guests");
  const router = useRouter();

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const guests = initialGuests;

  const filtered = guests.filter((g) => {
    if (filter === "all") return true;
    const status = g.rsvp?.status?.toLowerCase() ?? "pending";
    return status === filter;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await addGuestAction({
      eventId,
      name: newName,
      phone: newPhone || undefined,
    });

    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
    router.refresh();
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());

    // Skip header if it looks like one
    const start = /^name/i.test(lines[0]) ? 1 : 0;

    const parsed = lines.slice(start).map((line) => {
      const parts = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      return { name: parts[0], phone: parts[1] || undefined };
    }).filter((g) => g.name);

    if (parsed.length === 0) return;

    const result = await bulkImportGuestsAction({ eventId, guests: parsed });
    if (result && "count" in result) {
      showToast(`${t("importSuccess")}: ${result.count}`);
    }
    router.refresh();
    e.target.value = "";
  };

  const handleExportCsv = async () => {
    const result = await exportGuestsCsv(eventId, appUrl);
    if ("csv" in result && result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guests-${eventSlug}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyLinks = () => {
    const links = guests
      .map((g) => `${g.name}: ${appUrl}/${locale}/e/${eventSlug}/g/${g.token}`)
      .join("\n");
    navigator.clipboard.writeText(links);
    showToast(t("copied"));
  };

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(
      `${appUrl}/${locale}/e/${eventSlug}/g/${token}`
    );
    showToast(t("copied"));
  };

  const handleDeleteGuest = async (guestId: string) => {
    await deleteGuestAction(guestId, eventId);
    router.refresh();
  };

  const filters: FilterStatus[] = ["all", "confirmed", "declined", "maybe", "pending"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; {t("back")}
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          {t("title")} — {eventTitle}
        </h1>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: t("invited"), value: analytics.totalInvited },
            { label: t("confirmed"), value: analytics.rsvp.confirmed },
            { label: t("totalGuests"), value: analytics.totalGuestCount },
            { label: t("views"), value: analytics.totalViews },
            { label: t("conversion"), value: `${analytics.conversionRate}%` },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          {t("addGuest")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("importCsv")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleCsvImport}
        />
        <Button size="sm" variant="outline" onClick={handleExportCsv}>
          {t("exportCsv")}
        </Button>
        {guests.length > 0 && (
          <Button size="sm" variant="outline" onClick={handleCopyLinks}>
            {t("copyLinks")}
          </Button>
        )}
      </div>

      {/* Add Guest Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddGuest}
          className="mb-6 flex flex-wrap gap-3 rounded-lg border p-4"
        >
          <div className="flex-1">
            <Label>{t("name")}</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="w-48">
            <Label>{t("phone")}</Label>
            <Input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              type="tel"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" size="sm">
              {t("addGuest")}
            </Button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-sm ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            }`}
          >
            {t(f)}
            {f !== "all" && analytics && (
              <span className="ml-1 opacity-60">
                ({analytics.rsvp[f as keyof typeof analytics.rsvp]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Guest Table */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("noGuests")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-2 font-medium">{t("name")}</th>
                <th className="px-3 py-2 font-medium">{t("phone")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
                <th className="px-3 py-2 font-medium">{t("guestCount")}</th>
                <th className="px-3 py-2 font-medium">{t("message")}</th>
                <th className="px-3 py-2 font-medium">{t("views")}</th>
                <th className="px-3 py-2 font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => {
                const status = guest.rsvp?.status ?? "PENDING";
                return (
                  <tr key={guest.id} className="border-b">
                    <td className="px-3 py-2 font-medium">{guest.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {guest.phone || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={STATUS_VARIANT[status]}>
                        {t(status.toLowerCase())}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {guest.rsvp?.guestCount ?? "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-muted-foreground">
                      {guest.rsvp?.message || "—"}
                    </td>
                    <td className="px-3 py-2">{guest.viewCount}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(guest.token)}
                        >
                          {t("link")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteGuest(guest.id)}
                        >
                          &times;
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
