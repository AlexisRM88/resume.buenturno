"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ResumeWizard } from "@/components/wizard/ResumeWizard";
import { TermsModal } from "@/components/TermsModal";
import { api } from "../../../convex/_generated/api";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const myProfile = useQuery(api.users.getMyProfile);
  const ensureProfile = useMutation(api.users.ensureProfile);
  const acceptTerms = useMutation(api.users.acceptTerms);

  // Ensure profile exists when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      ensureProfile().catch(console.error);
    }
  }, [isAuthenticated, ensureProfile]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || myProfile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-indigo-600 font-semibold">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Show terms modal if user hasn't accepted yet
  const needsTerms = !myProfile || !myProfile.termsAcceptedAt;

  return (
    <>
      {needsTerms && (
        <TermsModal
          onAccept={async () => {
            await acceptTerms();
          }}
          isLoading={false}
        />
      )}
      <ResumeWizard />
    </>
  );
}
