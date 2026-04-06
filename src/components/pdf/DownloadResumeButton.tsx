"use client";

import dynamic from "next/dynamic";
import { ResumeData } from "@/lib/resume-types";
import { ResumeDocument } from "./ResumeDocument";
import { trackPdfDownload } from "@/lib/analytics";

// PDFDownloadLink solo funciona en el cliente
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <button className="w-full bg-green-600 text-white rounded-xl py-3.5 font-semibold opacity-60">Preparando PDF...</button> }
);

interface Props {
  data: ResumeData;
  experiences: ResumeData["experiences"];
  className?: string;
}

export function DownloadResumeButton({ data, experiences, className }: Props) {
  const fileName = `resume-${data.fullName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<ResumeDocument data={data} experiences={experiences} />}
      fileName={fileName}
      onClick={() => trackPdfDownload(data.template)}
    >
      {({ loading, error }) => (
        <button
          disabled={loading}
          className={`w-full rounded-xl py-3.5 font-semibold text-white transition ${
            error
              ? "bg-red-500"
              : loading
              ? "bg-green-400 opacity-60"
              : "bg-green-600 hover:bg-green-700"
          } ${className ?? ""}`}
        >
          {error ? "Error al generar PDF" : loading ? "Generando PDF..." : "⬇ Descargar Resume en PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
