"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONTACT_DRAFT_KEY,
  CONTACT_LIMITS,
  emptyContactBrief,
  hasContactBrief,
  readContactDraft,
  serializeContactDraft,
  type ContactBrief,
  type ContactField,
} from "@/lib/contact-draft";

type StorageState = "loading" | "empty" | "saved" | "unavailable";

export function useContactDraft(validServices: readonly string[], requestedService: string | null) {
  const [brief, setBrief] = useState<ContactBrief>(emptyContactBrief);
  const current = useRef(brief);
  const serviceHint = useRef("");
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const [storageState, setStorageState] = useState<StorageState>("loading");

  const persist = useCallback((next: ContactBrief): boolean => {
    try {
      if (hasContactBrief(next)) {
        window.sessionStorage.setItem(CONTACT_DRAFT_KEY, serializeContactDraft(next, serviceHint.current));
        setStorageState("saved");
      } else {
        window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
        setStorageState("empty");
      }
      return true;
    } catch {
      setStorageState("unavailable");
      return false;
    }
  }, []);

  useEffect(() => {
    if (requestedService === null) return;
    const hint = validServices.includes(requestedService) ? requestedService : "";
    if (hydrated.current) {
      if (hint === serviceHint.current) return;
      serviceHint.current = hint;
      // Same-route client navigation must retain the in-memory brief even if
      // the browser denied session storage. Only the explicit service changes.
      const next = { ...current.current, ...(hint ? { service: hint } : {}) };
      current.current = next;
      setBrief(next);
      setRestored(false);
      persist(next);
      return;
    }
    hydrated.current = true;
    let next = emptyContactBrief();
    let readable = true;
    serviceHint.current = hint;
    next.service = serviceHint.current;
    try {
      const saved = readContactDraft(window.sessionStorage.getItem(CONTACT_DRAFT_KEY), validServices, serviceHint.current);
      if (saved) {
        next = saved;
        setRestored(hasContactBrief(saved));
      }
    } catch {
      readable = false;
    }
    current.current = next;
    setBrief(next);
    if (readable) persist(next);
    else setStorageState("unavailable");
    setReady(true);
  }, [requestedService, validServices, persist]);

  function updateField(field: ContactField, value: string) {
    const bounded = value.replace(/\0/g, "").slice(0, CONTACT_LIMITS[field]).replace(/[\uD800-\uDBFF]$/, "");
    const next = { ...current.current, [field]: bounded };
    current.current = next;
    setBrief(next);
    setRestored(false);
    // Save during the edit, so a subsequent refresh or navigation cannot race
    // a debounce timer or leave the last typed characters behind.
    persist(next);
  }

  function clearDraft(): boolean {
    const next = emptyContactBrief();
    current.current = next;
    setBrief(next);
    setRestored(false);
    return persist(next);
  }

  const storageNote = storageState === "loading"
    ? "Preparing your draft…"
    : storageState === "unavailable"
      ? "This browser couldn’t save your draft. Copy it before leaving."
      : storageState === "saved"
        ? restored ? "Draft restored. Changes are saved in this tab." : "Draft saved in this tab."
        : "Your draft is kept in this tab as you type.";

  return { brief, updateField, clearDraft, ready, storageNote };
}
