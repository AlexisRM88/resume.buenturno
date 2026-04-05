"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-types";

// react-pdf no soporta hex de 8 dígitos (#RRGGBBAA) — usar rgba()
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  hoursPerWeek?: number;
  salary?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  canContact?: boolean;
  employerAddress?: string;
}

interface Props {
  data: ResumeData;
  experiences: Experience[];
}

function fDate(ym?: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  if (!m) return y; // solo año
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function fTime(value: string) {
  const [h24str, mStr] = value.split(":");
  const h24 = parseInt(h24str);
  const m = mStr ?? "00";
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m} ${ampm}`;
}

const DAY_ORDER = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function fAvail(data: ResumeData) {
  const map: Record<string, string> = {
    full_time: "Tiempo Completo (40+ hrs/semana)",
    part_time: "Medio Tiempo (menos de 40 hrs/semana)",
    flexible: "Flexible — tiempo completo o medio tiempo",
  };
  if (data.availabilityType !== "custom") return map[data.availabilityType] ?? "";
  if (!data.customSchedule?.length) return "Horario personalizado";
  const sorted = DAY_ORDER.map((d) => data.customSchedule!.find((s) => s.day === d)).filter(Boolean) as { day: string; start: string; end: string }[];
  return sorted.map((s) => `${s.day} ${fTime(s.start)}–${fTime(s.end)}`).join("   ");
}

function fSalary(data: ResumeData) {
  if (!data.salaryExpectation) return null;
  if (data.salaryExpectation === "minimum") return "Desde el mínimo de la industria";
  if (data.salaryExpectation === "negotiable") return "A negociar";
  if (data.salaryExpectation === "custom" && data.salaryExpectationCustom) return data.salaryExpectationCustom;
  return null;
}

// ─────────────────────────────────────────────
// MODERNO — sidebar izquierdo con color de acento
// ─────────────────────────────────────────────
function PdfModerno({ data, experiences }: Props) {
  const accent = data.accentColor;
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 9, backgroundColor: "#fff" },
    sidebar: { width: "32%", backgroundColor: accent, padding: 20, minHeight: "100%" },
    main: { width: "68%", padding: "20 22" },
    name: { fontFamily: "Helvetica-Bold", fontSize: 15, color: "#fff", marginBottom: 6 },
    divider: { borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.3)", marginBottom: 8 },
    label: { fontFamily: "Helvetica-Bold", fontSize: 7, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    contactVal: { fontSize: 7.5, color: "rgba(255,255,255,0.85)", marginBottom: 2, lineHeight: 1.4 },
    skillTag: { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, marginRight: 3, marginBottom: 3 },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap" },
    sideSection: { marginBottom: 14 },
    secTitle: { fontFamily: "Helvetica-Bold", fontSize: 7.5, color: accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5, borderBottomWidth: 0.5, borderBottomColor: accent, paddingBottom: 2 },
    expBlock: { marginBottom: 9 },
    expRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    expPos: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111" },
    expDates: { fontSize: 7.5, color: "#888" },
    expCo: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: accent, marginBottom: 2 },
    expDesc: { fontSize: 8, color: "#444", lineHeight: 1.5 },
    availText: { fontSize: 8, color: "#444" },
    eduVal: { fontSize: 8, color: "#444" },
    footer: { position: "absolute", bottom: 8, right: 14, fontSize: 6.5, color: "#aaa" },
  });

  return (
    <Page size="LETTER" style={s.page}>
      {/* Sidebar */}
      <View style={s.sidebar}>
        <Text style={s.name}>{data.fullName}</Text>
        <View style={s.divider} />
        <View style={s.sideSection}>
          {data.email ? <Text style={s.contactVal}>{data.email}</Text> : null}
          {data.phone ? <Text style={s.contactVal}>{data.phone}</Text> : null}
          {data.locality ? <Text style={s.contactVal}>{data.locality}</Text> : null}
        </View>
        {data.skills.length > 0 && (
          <View style={s.sideSection}>
            <Text style={s.label}>Habilidades</Text>
            <View style={s.skillsWrap}>
              {data.skills.map((sk) => <Text key={sk} style={s.skillTag}>{sk}</Text>)}
            </View>
          </View>
        )}
        <View style={s.sideSection}>
          <Text style={s.label}>Disponibilidad</Text>
          <Text style={s.contactVal}>{fAvail(data)}</Text>
          {fSalary(data) && (
            <Text style={s.contactVal}>Salario: {fSalary(data)}</Text>
          )}
        </View>
        {data.education?.[0]?.degree && (
          <View style={s.sideSection}>
            <Text style={s.label}>Educación</Text>
            <Text style={s.contactVal}>{data.education[0].degree}</Text>
            {data.education[0].institution ? <Text style={s.contactVal}>{data.education[0].institution}</Text> : null}
            {data.education[0].endDate ? <Text style={s.contactVal}>{data.education[0].endDate}</Text> : null}
          </View>
        )}
      </View>

      {/* Main */}
      <View style={s.main}>
        {experiences.length > 0 && (
          <View style={s.sideSection}>
            <Text style={s.secTitle}>Experiencia Laboral</Text>
            {experiences.map((exp, i) => (
              <View key={i} style={s.expBlock}>
                <View style={s.expRow}>
                  <Text style={s.expPos}>{exp.position}</Text>
                  <Text style={s.expDates}>{fDate(exp.startDate)} – {exp.isCurrent ? "Presente" : fDate(exp.endDate)}</Text>
                </View>
                <Text style={s.expCo}>{exp.company}</Text>
                {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={s.footer}>resume.buenturno.com</Text>
    </Page>
  );
}

// ─────────────────────────────────────────────
// ELEGANTE — header centrado, skills en pills
// ─────────────────────────────────────────────
function PdfElegante({ data, experiences }: Props) {
  const accent = data.accentColor;
  const s = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", padding: "0.5in" },
    header: { alignItems: "center", borderBottomWidth: 1.5, borderBottomColor: accent, paddingBottom: 10, marginBottom: 12 },
    name: { fontFamily: "Helvetica-Bold", fontSize: 20, color: "#111", marginBottom: 4 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    contactItem: { fontSize: 8, color: "#666" },
    secTitle: { fontFamily: "Helvetica-Bold", fontSize: 8, color: accent, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, textAlign: "center" },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 12 },
    skillPill: { borderWidth: 0.5, borderColor: accent, color: accent, fontSize: 7.5, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
    section: { marginBottom: 12 },
    expBlock: { marginBottom: 9, paddingLeft: 8, borderLeftWidth: 1.5, borderLeftColor: hexToRgba(accent, 0.25) },
    expRow: { flexDirection: "row", justifyContent: "space-between" },
    expPos: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111" },
    expDates: { fontSize: 7.5, color: "#888" },
    expCo: { fontSize: 8.5, color: "#666", marginBottom: 2, fontFamily: "Helvetica-Bold" },
    expDesc: { fontSize: 8, color: "#555", lineHeight: 1.5 },
    availText: { fontSize: 8.5, color: "#555", textAlign: "center" },
    eduText: { fontSize: 8.5, color: "#555", textAlign: "center" },
    footer: { position: "absolute", bottom: 8, right: 14, fontSize: 6.5, color: "#aaa" },
  });

  return (
    <Page size="LETTER" style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{data.fullName}</Text>
        <View style={s.contactRow}>
          {data.email ? <Text style={s.contactItem}>{data.email}</Text> : null}
          {data.phone ? <Text style={s.contactItem}>·  {data.phone}</Text> : null}
          {data.locality ? <Text style={s.contactItem}>·  {data.locality}</Text> : null}
        </View>
      </View>

      {data.skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>Habilidades</Text>
          <View style={s.skillsWrap}>
            {data.skills.map((sk) => <Text key={sk} style={s.skillPill}>{sk}</Text>)}
          </View>
        </View>
      )}

      {experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>Experiencia Laboral</Text>
          {experiences.map((exp, i) => (
            <View key={i} style={s.expBlock}>
              <View style={s.expRow}>
                <Text style={s.expPos}>{exp.position}</Text>
                <Text style={s.expDates}>{fDate(exp.startDate)} – {exp.isCurrent ? "Presente" : fDate(exp.endDate)}</Text>
              </View>
              <Text style={s.expCo}>{exp.company}</Text>
              {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {data.education?.[0]?.degree && (
        <View style={s.section}>
          <Text style={s.secTitle}>Educación</Text>
          <Text style={s.eduText}>{data.education[0].degree}{data.education[0].institution ? ` · ${data.education[0].institution}` : ""}{data.education[0].endDate ? ` · ${data.education[0].endDate}` : ""}</Text>
        </View>
      )}

      <View style={s.section}>
        <Text style={s.secTitle}>Disponibilidad</Text>
        <Text style={s.availText}>{fAvail(data)}</Text>
        {fSalary(data) && (
          <Text style={[s.availText, { marginTop: 3 }]}>Expectativa salarial: {fSalary(data)}</Text>
        )}
      </View>

      <Text style={s.footer}>resume.buenturno.com</Text>
    </Page>
  );
}

// ─────────────────────────────────────────────
// MINIMALISTA — limpio, mucho espacio
// ─────────────────────────────────────────────
function PdfMinimalista({ data, experiences }: Props) {
  const accent = data.accentColor;
  const s = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", padding: "0.6in" },
    name: { fontFamily: "Helvetica-Bold", fontSize: 22, color: "#111", marginBottom: 4 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 16 },
    contactItem: { fontSize: 8, color: "#888" },
    rule: { borderBottomWidth: 1, borderBottomColor: accent, marginBottom: 16 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
    skillItem: { fontSize: 8, color: "#555" },
    section: { marginBottom: 16 },
    secTitle: { fontFamily: "Helvetica-Bold", fontSize: 8, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 },
    expBlock: { marginBottom: 10 },
    expRow: { flexDirection: "row", justifyContent: "space-between" },
    expPos: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: "#111" },
    expDates: { fontSize: 7.5, color: "#aaa" },
    expCo: { fontSize: 8.5, color: "#888", marginBottom: 3 },
    expDesc: { fontSize: 8, color: "#666", lineHeight: 1.6 },
    availText: { fontSize: 8.5, color: "#888" },
    footer: { position: "absolute", bottom: 8, right: 14, fontSize: 6.5, color: "#aaa" },
  });

  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.name}>{data.fullName}</Text>
      <View style={s.contactRow}>
        {data.email ? <Text style={s.contactItem}>{data.email}</Text> : null}
        {data.phone ? <Text style={s.contactItem}>{data.phone}</Text> : null}
        {data.locality ? <Text style={s.contactItem}>{data.locality}</Text> : null}
      </View>

      {data.skills.length > 0 && (
        <View style={s.skillsRow}>
          {data.skills.map((sk) => <Text key={sk} style={s.skillItem}>{sk}</Text>)}
        </View>
      )}

      <View style={s.rule} />

      {experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>Experiencia</Text>
          {experiences.map((exp, i) => (
            <View key={i} style={s.expBlock}>
              <View style={s.expRow}>
                <Text style={s.expPos}>{exp.position}</Text>
                <Text style={s.expDates}>{fDate(exp.startDate)} – {exp.isCurrent ? "Presente" : fDate(exp.endDate)}</Text>
              </View>
              <Text style={s.expCo}>{exp.company}</Text>
              {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {data.education?.[0]?.degree && (
        <View style={s.section}>
          <Text style={s.secTitle}>Educación</Text>
          <Text style={s.expPos}>{data.education[0].degree}</Text>
          {data.education[0].institution ? <Text style={s.expCo}>{data.education[0].institution}{data.education[0].endDate ? ` · ${data.education[0].endDate}` : ""}</Text> : null}
        </View>
      )}

      <View style={s.section}>
        <Text style={s.secTitle}>Disponibilidad</Text>
        <Text style={s.availText}>{fAvail(data)}</Text>
        {fSalary(data) && (
          <Text style={[s.availText, { marginTop: 3 }]}>Expectativa salarial: {fSalary(data)}</Text>
        )}
      </View>

      <Text style={s.footer}>resume.buenturno.com</Text>
    </Page>
  );
}

// ─────────────────────────────────────────────
// FEDERAL — B&W, formato oficial USAJobs
// ─────────────────────────────────────────────
function PdfFederal({ data, experiences }: Props) {
  const s = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#000", padding: "0.5in" },
    header: { alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#000", paddingBottom: 8, marginBottom: 10 },
    name: { fontFamily: "Helvetica-Bold", fontSize: 14, color: "#000", textTransform: "uppercase", letterSpacing: 1 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 4 },
    contactItem: { fontSize: 8, color: "#000" },
    secTitle: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#000", textTransform: "uppercase", letterSpacing: 0.8, borderBottomWidth: 0.5, borderBottomColor: "#000", paddingBottom: 2, marginBottom: 6 },
    section: { marginBottom: 12 },
    skillsText: { fontSize: 8.5, color: "#000", lineHeight: 1.5 },
    expBlock: { marginBottom: 9 },
    expRow: { flexDirection: "row", justifyContent: "space-between" },
    expPos: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#000", textTransform: "uppercase" },
    expDates: { fontSize: 8, color: "#000" },
    expCo: { fontFamily: "Helvetica-Bold", fontSize: 9, color: "#000", marginBottom: 2 },
    federalRow: { flexDirection: "row", gap: 16, marginBottom: 1 },
    federalField: { fontSize: 8, color: "#000" },
    expDesc: { fontSize: 8.5, color: "#000", lineHeight: 1.5, marginTop: 2 },
    availText: { fontSize: 8.5, color: "#000" },
    footer: { position: "absolute", bottom: 10, right: 16, fontSize: 6.5, color: "#999" },
  });

  return (
    <Page size="LETTER" style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{data.fullName}</Text>
        <View style={s.contactRow}>
          {data.email ? <Text style={s.contactItem}>{data.email}</Text> : null}
          {data.phone ? <Text style={s.contactItem}>|  {data.phone}</Text> : null}
          {data.locality ? <Text style={s.contactItem}>|  {data.locality}</Text> : null}
        </View>
      </View>

      {data.skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>Specialized Skills / Habilidades</Text>
          <Text style={s.skillsText}>{data.skills.join("  ·  ")}</Text>
        </View>
      )}

      {experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>Work Experience / Experiencia Laboral</Text>
          {experiences.map((exp, i) => (
            <View key={i} style={s.expBlock}>
              <View style={s.expRow}>
                <Text style={s.expPos}>{exp.position}</Text>
                <Text style={s.expDates}>{fDate(exp.startDate)} – {exp.isCurrent ? "Presente" : fDate(exp.endDate)}</Text>
              </View>
              <Text style={s.expCo}>{exp.company}</Text>
              {exp.employerAddress ? <Text style={s.federalField}>{exp.employerAddress}</Text> : null}
              <View style={s.federalRow}>
                {exp.hoursPerWeek ? <Text style={s.federalField}>Hrs/semana: {exp.hoursPerWeek}</Text> : null}
                {exp.salary ? <Text style={s.federalField}>Salario: {exp.salary}</Text> : null}
              </View>
              {exp.supervisorName ? (
                <Text style={s.federalField}>
                  Supervisor: {exp.supervisorName}{exp.supervisorPhone ? ` · ${exp.supervisorPhone}` : ""}{exp.canContact !== undefined ? (exp.canContact ? " · PUEDE CONTACTAR" : " · NO CONTACTAR") : ""}
                </Text>
              ) : null}
              {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {data.education?.[0]?.degree && (
        <View style={s.section}>
          <Text style={s.secTitle}>Education / Educación</Text>
          <Text style={s.expCo}>{data.education[0].institution || data.education[0].degree}</Text>
          <Text style={s.federalField}>{data.education[0].degree}{data.education[0].endDate ? ` · ${data.education[0].endDate}` : ""}{data.education[0].gpa ? ` · GPA: ${data.education[0].gpa}` : ""}</Text>
        </View>
      )}

      <View style={s.section}>
        <Text style={s.secTitle}>Availability / Disponibilidad</Text>
        <Text style={s.availText}>{fAvail(data)}</Text>
        {fSalary(data) && (
          <Text style={[s.availText, { marginTop: 3 }]}>Salary Expectation / Expectativa: {fSalary(data)}</Text>
        )}
      </View>

      <Text style={s.footer}>resume.buenturno.com</Text>
    </Page>
  );
}

// ─────────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────────
export function ResumeDocument({ data, experiences }: Props) {
  const isFederal = data.isFederal || data.template === "federal";

  return (
    <Document title={`Resume - ${data.fullName}`} author={data.fullName} creator="BuenTurno Resume">
      {isFederal ? (
        <PdfFederal data={data} experiences={experiences} />
      ) : data.template === "elegante" ? (
        <PdfElegante data={data} experiences={experiences} />
      ) : data.template === "minimalista" ? (
        <PdfMinimalista data={data} experiences={experiences} />
      ) : (
        <PdfModerno data={data} experiences={experiences} />
      )}
    </Document>
  );
}
