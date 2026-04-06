// GA4 event tracking utility
// Measurement ID: G-DMRWKNGTVJ

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag(...args);
}

// ── Wizard ──────────────────────────────────────────────────────────────────

export function trackWizardStep(step: number, stepName: string) {
  gtag("event", "wizard_step_view", {
    event_category: "wizard",
    step_number: step + 1,
    step_name: stepName,
  });
}

export function trackWizardNext(fromStep: number, stepName: string) {
  gtag("event", "wizard_step_complete", {
    event_category: "wizard",
    step_number: fromStep + 1,
    step_name: stepName,
  });
}

export function trackResumeSaved(template: string, locality: string) {
  gtag("event", "resume_saved", {
    event_category: "resume",
    template,
    locality,
  });
}

export function trackPdfDownload(template: string) {
  gtag("event", "pdf_download", {
    event_category: "resume",
    template,
  });
}

export function trackTemplateSelected(template: string) {
  gtag("event", "template_selected", {
    event_category: "resume",
    template,
  });
}

// ── Auth / Sign-in ───────────────────────────────────────────────────────────

export function trackRoleSelected(role: "talent" | "employer") {
  gtag("event", "role_selected", {
    event_category: "auth",
    role,
  });
}

export function trackEmailSubmit(role: "talent" | "employer") {
  gtag("event", "email_submit", {
    event_category: "auth",
    role,
  });
}

export function trackLoginSuccess(role: "talent" | "employer") {
  gtag("event", "login", {
    event_category: "auth",
    method: "email_otp",
    role,
  });
}

// ── Employer ─────────────────────────────────────────────────────────────────

export function trackEmployerSearch(filters: Record<string, string>) {
  gtag("event", "employer_search", {
    event_category: "employers",
    ...filters,
  });
}

export function trackCandidateView(locality: string) {
  gtag("event", "candidate_profile_view", {
    event_category: "employers",
    locality,
  });
}

// ── Landing ──────────────────────────────────────────────────────────────────

export function trackCTAClick(label: string) {
  gtag("event", "cta_click", {
    event_category: "landing",
    label,
  });
}
