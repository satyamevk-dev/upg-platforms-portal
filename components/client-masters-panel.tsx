"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  PORTAL_DISCLOSURE,
  PORTAL_MODAL_SHEET,
  PORTAL_TABLE_FRAME,
  PORTAL_TABLE_HEAD_ROW,
} from "@/lib/portal-ui-classes";

export type ClientMasterRow = {
  id: string;
  name: string;
  /** Trainers and trainees with this client in Manage portal users; rename is blocked while greater than zero. */
  linkedTrainerTraineeCount: number;
};

const inputClass =
  "w-full rounded-xl border border-[#d6cfc4] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00A89E] focus:outline-none focus:ring-2 focus:ring-[#00A89E]/25";

type Props = {
  initialMasters: ClientMasterRow[];
};

export function ClientMastersPanel({ initialMasters }: Props) {
  const router = useRouter();
  const [addName, setAddName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSaving, setAddSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    client: ClientMasterRow;
    step: 1 | 2;
  } | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteApiError, setDeleteApiError] = useState<string | null>(null);

  const startEdit = useCallback((m: ClientMasterRow) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditError(null);
  }, []);

  const submitAdd = useCallback(async () => {
    setAddError(null);
    setAddSaving(true);
    try {
      const res = await fetch("/api/client-masters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName.trim() }),
        credentials: "same-origin",
      });
      const data = (await res.json()) as { master?: ClientMasterRow; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not create client");
      }
      setAddName("");
      router.refresh();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Could not create client");
    } finally {
      setAddSaving(false);
    }
  }, [addName, router]);

  const submitEdit = useCallback(async () => {
    if (!editingId) return;
    setEditError(null);
    setEditSaving(true);
    try {
      const res = await fetch(`/api/client-masters/${encodeURIComponent(editingId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
        credentials: "same-origin",
      });
      const data = (await res.json()) as { master?: ClientMasterRow; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not update client");
      }
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Could not update client");
    } finally {
      setEditSaving(false);
    }
  }, [editingId, editName, router]);

  const closeDeleteDialog = useCallback(() => {
    if (deleteSaving) return;
    setDeleteDialog(null);
    setDeleteApiError(null);
  }, [deleteSaving]);

  const openDeleteDialog = useCallback((m: ClientMasterRow) => {
    setDeleteApiError(null);
    setDeleteDialog({ client: m, step: 1 });
  }, []);

  const advanceDeleteStep = useCallback(() => {
    setDeleteDialog((d) => (d && d.step === 1 ? { ...d, step: 2 } : d));
  }, []);

  const backDeleteStep = useCallback(() => {
    setDeleteDialog((d) => (d && d.step === 2 ? { ...d, step: 1 } : d));
    setDeleteApiError(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog || deleteDialog.step !== 2) return;
    const c = deleteDialog.client;
    setDeleteApiError(null);
    setDeleteSaving(true);
    try {
      const res = await fetch(`/api/client-masters/${encodeURIComponent(c.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not delete client");
      }
      if (editingId === c.id) {
        setEditingId(null);
        setEditError(null);
      }
      setDeleteDialog(null);
      router.refresh();
    } catch (e) {
      setDeleteApiError(e instanceof Error ? e.message : "Could not delete client");
    } finally {
      setDeleteSaving(false);
    }
  }, [deleteDialog, editingId, router]);

  useEffect(() => {
    if (!deleteDialog || deleteSaving) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      setDeleteDialog((d) => {
        if (!d) return null;
        if (d.step === 2) return { client: d.client, step: 1 };
        return null;
      });
      setDeleteApiError(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteDialog, deleteSaving]);

  return (
    <div className="mt-6 space-y-6">
      <details className={PORTAL_DISCLOSURE}>
        <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-semibold text-slate-900 sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
          Add client
        </summary>
        <div className="space-y-3 border-t border-[#d8d0c4]/40 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <label className="flex max-w-md flex-col gap-1 text-xs font-medium text-slate-700">
            Client name
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className={inputClass}
              maxLength={120}
              autoComplete="off"
            />
          </label>
          {addError ? (
            <p className="text-sm text-rose-700" role="alert">
              {addError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void submitAdd()}
            disabled={addSaving}
            className="rounded-xl bg-[#00A89E] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#00A89E]/15 hover:bg-[#008f86] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addSaving ? "Saving…" : "Add client"}
          </button>
        </div>
      </details>

      {initialMasters.length === 0 ? (
        <p className="text-sm text-slate-600">No client masters yet. Add one above.</p>
      ) : (
        <div className={PORTAL_TABLE_FRAME}>
          <table className="w-full max-w-xl border-collapse text-left text-sm">
            <thead>
              <tr className={PORTAL_TABLE_HEAD_ROW}>
                <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8d0c4]">
              {initialMasters.map((m) => (
                <tr key={m.id} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {editingId === m.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={inputClass}
                        maxLength={120}
                        aria-label="Edit client name"
                      />
                    ) : (
                      <span className="inline-flex flex-wrap items-center gap-2">
                        <span>{m.name}</span>
                        {m.linkedTrainerTraineeCount > 0 ? (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/80">
                            {m.linkedTrainerTraineeCount} mapped user
                            {m.linkedTrainerTraineeCount === 1 ? "" : "s"}
                          </span>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === m.id ? (
                      <span className="inline-flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void submitEdit()}
                          disabled={editSaving}
                          className="rounded-lg border border-[#00A89E]/40 bg-[#e6f7f5] px-2.5 py-1 text-xs font-semibold text-[#00786f] hover:bg-[#d4f0ed] disabled:opacity-50"
                        >
                          {editSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={editSaving}
                          className="rounded-lg border border-[#d6cfc4] px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-[#faf9f7] disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(m)}
                          disabled={m.linkedTrainerTraineeCount > 0}
                          title={
                            m.linkedTrainerTraineeCount > 0
                              ? "Map every trainer and trainee to another client in Manage portal users before renaming."
                              : undefined
                          }
                          className="rounded-lg border border-[#d6cfc4] px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-[#faf9f7] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(m)}
                          disabled={!!deleteSaving}
                          className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editError ? (
        <p className="text-sm text-rose-700" role="alert">
          {editError}
        </p>
      ) : null}

      {deleteDialog && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 p-4"
              role="presentation"
              onClick={(e) => {
                if (e.target !== e.currentTarget || deleteSaving) return;
                setDeleteDialog((d) => {
                  if (!d) return null;
                  if (d.step === 2) return { client: d.client, step: 1 };
                  return null;
                });
                setDeleteApiError(null);
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-client-dialog-title"
                className={PORTAL_MODAL_SHEET}
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  id="delete-client-dialog-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  {deleteDialog.step === 1 ? "Delete client?" : "Confirm deletion"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{deleteDialog.client.name}</span>
                </p>
                {deleteDialog.step === 1 ? (
                  <>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">
                      You will be asked to confirm again. Deletion only succeeds if no trainers or
                      trainees are mapped to this client (remove them in Manage portal users first)
                      and no training plans use this client.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeDeleteDialog}
                        disabled={deleteSaving}
                        className="rounded-xl border border-[#d6cfc4] bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-[#f5f3f0] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={advanceDeleteStep}
                        disabled={deleteSaving}
                        className="rounded-xl bg-[#00A89E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f86] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Continue to confirm
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm leading-relaxed text-slate-800">
                      <span className="font-semibold text-rose-900">Last step:</span> Permanently
                      remove this client. The server will reject the request if any trainer, trainee,
                      or training plan is still tied to it.
                    </p>
                    {deleteApiError ? (
                      <p className="mt-3 text-sm text-rose-700" role="alert">
                        {deleteApiError}
                      </p>
                    ) : null}
                    <div className="mt-6 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={backDeleteStep}
                        disabled={deleteSaving}
                        className="rounded-xl border border-[#d6cfc4] bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-[#f5f3f0] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => void confirmDelete()}
                        disabled={deleteSaving}
                        className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleteSaving ? "Deleting…" : "Delete permanently"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
