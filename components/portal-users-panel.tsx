"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PasswordRequirementsHint } from "@/components/password-requirements-hint";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";
import {
  PORTAL_EMAIL_UNIQUENESS_HINT,
  duplicatePortalUserEmailMessage,
} from "@/lib/portal-user-email-messages";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/password-policy";
import { portalRoleLabel } from "@/lib/portal-users-labels";
import { sortMasterClients, trainingPlanClientSelectLabel } from "@/lib/training-plan-clients";
import {
  PORTAL_DISCLOSURE,
  PORTAL_MODAL_SHEET,
  PORTAL_TABLE_HEAD_ROW,
} from "@/lib/portal-ui-classes";

export type PortalUserSerializable = {
  id: string;
  email: string;
  name: string | null;
  role: "super_admin" | "trainer" | "trainee";
  mappedClient: { id: string; name: string | null; email: string } | null;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
};

type MasterClientRow = { id: string; name: string };

const inputClass =
  "w-full rounded-xl border border-[#D0D3E7] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#F46036] focus:outline-none focus:ring-2 focus:ring-[#F46036]/25";

const ROLES: PortalUserSerializable["role"][] = ["super_admin", "trainer", "trainee"];

function roleBadgeClass(role: PortalUserSerializable["role"]) {
  if (role === "super_admin") {
    return "inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950";
  }
  if (role === "trainer") {
    return "inline-flex rounded-full bg-[#ECFBFA] px-2.5 py-0.5 text-xs font-semibold text-[#b23d1e]";
  }
  return "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800";
}

function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Sends client master id (or empty). */
function mappedClientIdForApi(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  return t;
}

type Props = {
  initialUsers: PortalUserSerializable[];
  /** Same source as `SUPER_ADMIN_EMAIL` / seed — platform owner role cannot be edited. */
  platformOwnerEmail: string;
};

export function PortalUsersPanel({ initialUsers, platformOwnerEmail }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<PortalUserSerializable["role"]>("trainee");
  const [editPassword, setEditPassword] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteSavingId, setDeleteSavingId] = useState<string | null>(null);
  /** Two-step in-app confirmation (never rely on `window.confirm` — often blocked in previews). */
  const [deleteDialog, setDeleteDialog] = useState<{
    user: PortalUserSerializable;
    step: 1 | 2;
  } | null>(null);

  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState<"" | PortalUserSerializable["role"]>("");
  const [addMappedClientId, setAddMappedClientId] = useState("");
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSaving, setAddSaving] = useState(false);

  const [masterClients, setMasterClients] = useState<MasterClientRow[]>([]);
  const [masterListError, setMasterListError] = useState<string | null>(null);

  const [editMappedClientId, setEditMappedClientId] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  /** Collapsible role sections; omitted key defaults to collapsed. */
  const [roleSectionOpen, setRoleSectionOpen] = useState<
    Partial<Record<PortalUserSerializable["role"], boolean>>
  >({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/client-masters", { credentials: "same-origin" });
        const data = (await res.json()) as { masters?: MasterClientRow[]; error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setMasterListError(
            data.error ??
              (res.status === 401
                ? "Sign in again to load client masters."
                : res.status === 403
                  ? "Your role cannot load the client master list."
                  : `Could not load client masters (${res.status}).`),
          );
          setMasterClients([]);
          return;
        }
        setMasterListError(null);
        setMasterClients(Array.isArray(data.masters) ? data.masters : []);
      } catch (e) {
        if (!cancelled) {
          setMasterListError(e instanceof Error ? e.message : "Could not load client masters.");
          setMasterClients([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startEdit = useCallback((u: PortalUserSerializable) => {
    setEditingId(u.id);
    setEditEmail(u.email);
    setEditName(u.name ?? "");
    setEditRole(u.role);
    setEditMappedClientId(u.mappedClient?.id?.trim() ?? "");
    setEditPassword("");
    setShowEditPassword(false);
    setEditError(null);
    setRoleSectionOpen((prev) => ({ ...prev, [u.role]: true }));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setShowEditPassword(false);
    setEditError(null);
  }, []);

  const deleteUserAllowed = useCallback(
    (u: PortalUserSerializable) => {
      if (emailsMatch(u.email, platformOwnerEmail)) return false;
      return u.role === "trainer" || u.role === "trainee";
    },
    [platformOwnerEmail],
  );

  const performDeleteUser = useCallback(
    async (u: PortalUserSerializable) => {
      setDeleteSavingId(u.id);
      setEditError(null);
      try {
        const res = await fetch(`/api/users/${u.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Could not delete user");
        }
        if (editingId === u.id) {
          cancelEdit();
        }
        router.refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not delete user";
        if (editingId === u.id) setEditError(msg);
        window.alert(msg);
        throw e;
      } finally {
        setDeleteSavingId(null);
      }
    },
    [cancelEdit, editingId, router],
  );

  const openDeleteDialog = useCallback((u: PortalUserSerializable) => {
    if (!deleteUserAllowed(u)) return;
    setDeleteDialog({ user: u, step: 1 });
  }, [deleteUserAllowed]);

  const closeDeleteDialog = useCallback(() => {
    if (deleteSavingId) return;
    setDeleteDialog(null);
  }, [deleteSavingId]);

  const advanceDeleteDialogStep = useCallback(() => {
    setDeleteDialog((d) => (d && d.step === 1 ? { ...d, step: 2 } : d));
  }, []);

  const backDeleteDialogStep = useCallback(() => {
    setDeleteDialog((d) => (d && d.step === 2 ? { ...d, step: 1 } : d));
  }, []);

  const confirmDeleteFromDialog = useCallback(async () => {
    const u = deleteDialog?.user;
    const step = deleteDialog?.step;
    if (!u || step !== 2) return;
    try {
      await performDeleteUser(u);
      setDeleteDialog(null);
    } catch {
      /* performDeleteUser already alerted */
    }
  }, [deleteDialog, performDeleteUser]);

  useEffect(() => {
    if (!deleteDialog || deleteSavingId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDeleteDialog((d) => {
        if (!d) return null;
        if (d.step === 2) return { user: d.user, step: 1 };
        return null;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteDialog, deleteSavingId]);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    const row = initialUsers.find((x) => x.id === editingId);
    const roleLocked = row ? emailsMatch(row.email, platformOwnerEmail) : false;

    setEditError(null);
    const normalizedEditEmail = editEmail.trim().toLowerCase();
    const emailClash = initialUsers.find(
      (u) => u.id !== editingId && emailsMatch(u.email, normalizedEditEmail),
    );
    if (emailClash) {
      setEditError(duplicatePortalUserEmailMessage(emailClash.role));
      return;
    }

    setEditSaving(true);
    try {
      const body: Record<string, unknown> = {
        email: normalizedEditEmail,
        name: editName.trim() || null,
      };
      if (!roleLocked) body.role = editRole;
      if (editPassword.trim()) body.password = editPassword;
      body.mappedClientId = mappedClientIdForApi(editMappedClientId);

      const res = await fetch(`/api/users/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Update failed");
      }
      setEditingId(null);
      setEditPassword("");
      setShowEditPassword(false);
      router.refresh();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Could not update user");
    } finally {
      setEditSaving(false);
    }
  }, [
    editEmail,
    editMappedClientId,
    editName,
    editPassword,
    editRole,
    editingId,
    initialUsers,
    platformOwnerEmail,
    router,
  ]);

  const submitAdd = useCallback(async () => {
    setAddError(null);
    const normalizedAddEmail = addEmail.trim().toLowerCase();
    const emailClash = initialUsers.find((u) => emailsMatch(u.email, normalizedAddEmail));
    if (emailClash) {
      setAddError(duplicatePortalUserEmailMessage(emailClash.role));
      return;
    }
    const trimmedName = addName.trim();
    if (!trimmedName) {
      setAddError("Enter a name.");
      return;
    }
    if (!addRole) {
      setAddError("Choose a role.");
      return;
    }
    if (!mappedClientIdForApi(addMappedClientId)) {
      setAddError("Choose a client from the list.");
      return;
    }

    setAddSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedAddEmail,
          password: addPassword,
          name: trimmedName,
          role: addRole,
          mappedClientId: mappedClientIdForApi(addMappedClientId),
        }),
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not create user");
      }
      setAddEmail("");
      setAddPassword("");
      setShowAddPassword(false);
      setAddName("");
      setAddRole("");
      setAddMappedClientId("");
      router.refresh();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Could not create user");
    } finally {
      setAddSaving(false);
    }
  }, [addEmail, addPassword, addName, addRole, addMappedClientId, initialUsers, router]);

  const platformOwnerUser = useMemo(
    () => initialUsers.find((u) => emailsMatch(u.email, platformOwnerEmail)) ?? null,
    [initialUsers, platformOwnerEmail],
  );

  const usersGroupedByRole = useMemo(() => {
    return ROLES.map((role) => ({
      role,
      users: initialUsers.filter(
        (u) => u.role === role && !emailsMatch(u.email, platformOwnerEmail),
      ),
    })).filter((g) => g.users.length > 0);
  }, [initialUsers, platformOwnerEmail]);

  const mappingOptionsSorted = useMemo(
    () => sortMasterClients(masterClients),
    [masterClients],
  );

  const addMappingReady = mappingOptionsSorted.length > 0;

  /** Current mapping not in loaded master list (e.g. stale id) — keep option so the select stays controlled. */
  const editOrphanMappedMaster = useMemo(() => {
    const id = editMappedClientId.trim();
    if (!editingId || !id) return null;
    if (mappingOptionsSorted.some((m) => m.id === id)) return null;
    const mc = initialUsers.find((x) => x.id === editingId)?.mappedClient;
    if (mc && mc.id.trim() === id) return mc;
    return null;
  }, [editMappedClientId, editingId, initialUsers, mappingOptionsSorted]);

  return (
    <>
    <div className="mt-6 space-y-8">
      <details className={PORTAL_DISCLOSURE}>
        <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-semibold text-slate-900 sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
          Add user
        </summary>
        <div className="space-y-4 border-t border-[#D0D3E7]/40 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <p className="text-xs text-slate-600">
          Creates a database account with a password this person will use at login.{" "}
          <span className="font-medium text-slate-700">{PORTAL_EMAIL_UNIQUENESS_HINT}</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Email
            <input
              type="email"
              autoComplete="off"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Password
            <div className="relative">
              <input
                id="add-user-password-input"
                type={showAddPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                className={`${inputClass} pr-14`}
                aria-describedby="add-user-password-strength add-user-password-requirements"
              />
              <button
                type="button"
                onClick={() => setShowAddPassword((v) => !v)}
                aria-pressed={showAddPassword}
                aria-controls="add-user-password-input"
                aria-label={showAddPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[#b23d1e] underline decoration-[#b23d1e]/40 underline-offset-2 hover:bg-[#F46036]/10 hover:text-[#7d2b13] focus:outline-none focus:ring-2 focus:ring-[#F46036]/40"
              >
                {showAddPassword ? "Hide" : "Show"}
              </button>
            </div>
            <PasswordStrengthMeter
              password={addPassword}
              id="add-user-password-strength"
              className="mt-2"
            />
            <PasswordRequirementsHint
              id="add-user-password-requirements"
              className="mt-1 text-xs font-normal leading-snug text-slate-600 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Name
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className={inputClass}
              autoComplete="name"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Role
            <select
              value={addRole}
              onChange={(e) => {
                const v = e.target.value;
                setAddRole(v === "" ? "" : (v as PortalUserSerializable["role"]));
              }}
              className={inputClass}
              required
              aria-label="Role, required"
            >
              <option value="" />
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {portalRoleLabel(r)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Client
            <select
              value={addMappedClientId}
              onChange={(e) => setAddMappedClientId(e.target.value)}
              className={inputClass}
              aria-label="Client master, required"
              required
            >
              <option value="" />
              {mappingOptionsSorted.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <span className="text-[11px] font-normal leading-snug text-slate-500">
              Client from the master list. Required for new users.
            </span>
            {masterListError && !addMappingReady ? (
              <span className="text-[11px] font-normal text-rose-700" role="alert">
                {masterListError}
              </span>
            ) : null}
          </label>
        </div>
        {addError ? (
          <p className="text-sm text-rose-700" role="alert">
            {addError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void submitAdd()}
          disabled={addSaving}
          className="rounded-xl bg-[#F46036] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#F46036]/15 hover:bg-[#d44a20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addSaving ? "Creating…" : "Create user"}
        </button>
        </div>
      </details>

      {initialUsers.length === 0 ? (
        <p className="text-sm text-slate-600">No users found in the database yet.</p>
      ) : (
        <div className="space-y-3">
          {platformOwnerUser ? (
            <div className={PORTAL_DISCLOSURE}>
              <p className="border-b border-[#D0D3E7]/40 px-4 py-3 text-sm font-semibold text-[#b23d1e] sm:px-5 sm:py-3.5">
                Platform owner
              </p>
              <div className="overflow-x-auto bg-white/80">
                <table className="w-full max-w-xl border-collapse text-left text-sm">
                  <thead>
                    <tr className={PORTAL_TABLE_HEAD_ROW}>
                      <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {platformOwnerUser.name?.trim() || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-[#F7F7FF] px-1.5 py-0.5 text-xs text-slate-800">
                          {platformOwnerUser.email}
                        </code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {usersGroupedByRole.map((group) => {
            const showRoleDbColumn = group.role === "super_admin";
            const editRowColSpan = showRoleDbColumn ? 7 : 6;
            return (
            <details
              key={group.role}
              className={`${PORTAL_DISCLOSURE} [&_summary::-webkit-details-marker]:hidden`}
              open={roleSectionOpen[group.role] ?? false}
              onToggle={(e) => {
                const el = e.currentTarget;
                setRoleSectionOpen((prev) => ({ ...prev, [group.role]: el.open }));
              }}
            >
              <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-semibold text-[#b23d1e] sm:px-5 sm:py-3.5">
                <span className="text-xs font-bold uppercase tracking-[0.14em]">
                  {portalRoleLabel(group.role)}
                </span>
                <span className="ml-2 font-semibold normal-case tracking-normal text-slate-500">
                  ({group.users.length})
                </span>
              </summary>
              <div className="overflow-x-auto border-t border-[#D0D3E7]/40 bg-white/80">
                <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className={PORTAL_TABLE_HEAD_ROW}>
                      <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Email</th>
                      {showRoleDbColumn ? (
                        <th className="px-4 py-3 font-semibold text-slate-800" title="Value stored in User.role">
                          Role (DB)
                        </th>
                      ) : null}
                      <th className="px-4 py-3 font-semibold text-slate-800">Client</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Password</th>
                      <th className="hidden px-4 py-3 font-semibold text-slate-800 md:table-cell">
                        Added
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D3E7]">
                    {group.users.map((u) => (
                      <Fragment key={u.id}>
                        <tr className="text-slate-700">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {u.name?.trim() || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <code className="rounded bg-[#F7F7FF] px-1.5 py-0.5 text-xs text-slate-800">
                              {u.email}
                            </code>
                          </td>
                          {showRoleDbColumn ? (
                            <td className="px-4 py-3">
                              <span className={roleBadgeClass(u.role)} title="User.role in the database">
                                <span className="font-mono normal-case tracking-tight">{u.role}</span>
                              </span>
                            </td>
                          ) : null}
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {emailsMatch(u.email, platformOwnerEmail) ? (
                              <span
                                className="text-slate-400"
                                title="Not applicable for the platform owner"
                              >
                                —
                              </span>
                            ) : u.mappedClient ? (
                              trainingPlanClientSelectLabel(u.mappedClient)
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">
                            {emailsMatch(u.email, platformOwnerEmail) ? (
                              <span
                                className="text-slate-400"
                                title="Not shown for the platform owner"
                              >
                                —
                              </span>
                            ) : u.hasPassword ? (
                              <span title="Password is set; the actual value is not stored in a readable form.">
                                ••••••••
                              </span>
                            ) : (
                              <span className="text-slate-400">Not set</span>
                            )}
                          </td>
                          <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                            {new Date(u.createdAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            {emailsMatch(u.email, platformOwnerEmail) ? (
                              <span
                                className="text-xs text-slate-400"
                                title="Platform owner account is not editable here"
                              >
                                —
                              </span>
                            ) : (
                              <span className="inline-flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(u)}
                                  className="rounded-lg border border-[#D0D3E7] px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-[#F7F7FF]"
                                >
                                  Edit
                                </button>
                                {deleteUserAllowed(u) ? (
                                  <button
                                    type="button"
                                    onClick={() => openDeleteDialog(u)}
                                    disabled={!!deleteSavingId}
                                    className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {deleteSavingId === u.id ? "Deleting…" : "Delete"}
                                  </button>
                                ) : null}
                              </span>
                            )}
                          </td>
                        </tr>
                        {editingId === u.id && !emailsMatch(u.email, platformOwnerEmail) ? (
                          <tr className="bg-[#F7F7FF]/50">
                            <td colSpan={editRowColSpan} className="px-4 py-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Edit user
                              </p>
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                                  Email
                                  <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                                  Name
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                                  Role
                                  <select
                                    value={editRole}
                                    onChange={(e) =>
                                      setEditRole(e.target.value as PortalUserSerializable["role"])
                                    }
                                    className={inputClass}
                                  >
                                    {ROLES.map((r) => (
                                      <option key={r} value={r}>
                                        {portalRoleLabel(r)}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                                  Client
                                  <select
                                    key={`edit-client-${editingId}`}
                                    value={editMappedClientId}
                                    onChange={(e) => setEditMappedClientId(e.target.value)}
                                    className={inputClass}
                                    aria-label="Client master"
                                  >
                                    <option value="">No client</option>
                                    {mappingOptionsSorted.map((m) => (
                                      <option key={m.id} value={m.id}>
                                        {m.name}
                                      </option>
                                    ))}
                                    {editOrphanMappedMaster ? (
                                      <option
                                        key="orphan-mapped-master"
                                        value={editOrphanMappedMaster.id}
                                      >
                                        {trainingPlanClientSelectLabel(editOrphanMappedMaster)}
                                      </option>
                                    ) : null}
                                  </select>
                                  {masterListError ? (
                                    <span className="text-[11px] font-normal text-rose-700" role="alert">
                                      {masterListError}
                                    </span>
                                  ) : null}
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                                  New password (optional)
                                  <div className="relative">
                                    <input
                                      id={`edit-user-password-input-${editingId}`}
                                      type={showEditPassword ? "text" : "password"}
                                      autoComplete="new-password"
                                      maxLength={PASSWORD_MAX_LENGTH}
                                      value={editPassword}
                                      onChange={(e) => setEditPassword(e.target.value)}
                                      placeholder="Leave blank to keep current"
                                      className={`${inputClass} pr-14`}
                                      aria-describedby={`edit-user-password-strength-${editingId} edit-user-password-requirements-${editingId}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowEditPassword((v) => !v)}
                                      aria-pressed={showEditPassword}
                                      aria-controls={`edit-user-password-input-${editingId}`}
                                      aria-label={showEditPassword ? "Hide new password" : "Show new password"}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[#b23d1e] underline decoration-[#b23d1e]/40 underline-offset-2 hover:bg-[#F46036]/10 hover:text-[#7d2b13] focus:outline-none focus:ring-2 focus:ring-[#F46036]/40"
                                    >
                                      {showEditPassword ? "Hide" : "Show"}
                                    </button>
                                  </div>
                                  <PasswordStrengthMeter
                                    password={editPassword}
                                    id={`edit-user-password-strength-${editingId}`}
                                    className="mt-2"
                                  />
                                  <PasswordRequirementsHint
                                    id={`edit-user-password-requirements-${editingId}`}
                                    className="mt-1 text-xs font-normal leading-snug text-slate-600 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4"
                                  />
                                </label>
                              </div>
                              {editError ? (
                                <p className="mt-3 text-sm text-rose-700" role="alert">
                                  {editError}
                                </p>
                              ) : null}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => void saveEdit()}
                                  disabled={editSaving}
                                  className="rounded-xl bg-[#F46036] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d44a20] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {editSaving ? "Saving…" : "Save changes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={editSaving}
                                  className="rounded-xl border border-[#D0D3E7] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            );
          })}
        </div>
      )}
    </div>

    {deleteDialog && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 p-4"
            role="presentation"
            onClick={(e) => {
              if (e.target !== e.currentTarget || deleteSavingId) return;
              setDeleteDialog((d) => {
                if (!d) return null;
                if (d.step === 2) return { user: d.user, step: 1 };
                return null;
              });
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-user-dialog-title"
              className={PORTAL_MODAL_SHEET}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="delete-user-dialog-title"
                className="text-lg font-semibold text-slate-900"
              >
                {deleteDialog.step === 1 ? "Delete portal user?" : "Confirm deletion"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-medium text-slate-800">
                  {portalRoleLabel(deleteDialog.user.role)}
                </span>
                <span className="mx-1.5 text-slate-400">·</span>
                <code className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-900">
                  {deleteDialog.user.email}
                </code>
              </p>
              {deleteDialog.step === 1 ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">
                    This will remove the account and sign-in for this person. You will get a second
                    step before anything is deleted.
                  </p>
                  {deleteDialog.user.role === "trainee" ? (
                    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950">
                      <span className="font-semibold">Trainee account:</span> This removes portal
                      access for this person. Training plans for their organization are kept in the
                      system.
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeDeleteDialog}
                      disabled={!!deleteSavingId}
                      className="rounded-xl border border-[#D0D3E7] bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-[#F7F7FF] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={advanceDeleteDialogStep}
                      disabled={!!deleteSavingId}
                      className="rounded-xl bg-[#F46036] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d44a20] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue to confirm
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-slate-800">
                    <span className="font-semibold text-rose-900">Last step:</span> This action
                    cannot be undone. The user will be removed from the database
                    .
                  </p>
                  <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={backDeleteDialogStep}
                      disabled={!!deleteSavingId}
                      className="rounded-xl border border-[#D0D3E7] bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-[#F7F7FF] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => void confirmDeleteFromDialog()}
                      disabled={!!deleteSavingId}
                      className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleteSavingId ? "Deleting…" : "Delete permanently"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body,
        )
      : null}
    </>
  );
}
