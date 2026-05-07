import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((d: {
    nome: string;
    telefone?: string;
    endereco?: string;
    cep?: string;
    numero?: string;
    amount?: number;
    transaction_id?: string;
  }) => d)
  .handler(async ({ data }) => {
    if (!data.nome || data.nome.length > 200) return { error: "invalid" };
    const { error } = await supabaseAdmin.from("leads").insert({
      nome: data.nome.slice(0, 200),
      telefone: data.telefone?.slice(0, 50) || null,
      endereco: data.endereco?.slice(0, 300) || null,
      cep: data.cep?.slice(0, 20) || null,
      numero: data.numero?.slice(0, 20) || null,
      amount: data.amount ?? null,
      transaction_id: data.transaction_id ?? null,
    });
    if (error) {
      console.error("saveLead", error);
      return { error: error.message };
    }
    return { ok: true };
  });

export const markLeadPaid = createServerFn({ method: "POST" })
  .inputValidator((d: { transaction_id: string }) => d)
  .handler(async ({ data }) => {
    if (!data.transaction_id) return { ok: false };
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ paid: true, paid_at: new Date().toISOString() })
      .eq("transaction_id", data.transaction_id);
    if (error) console.error("markLeadPaid", error);
    return { ok: !error };
  });

export const listLeadsStats = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("id, paid")
    .limit(10000);
  if (error) return { total: 0, paid: 0, unpaid: 0 };
  const total = data.length;
  const paid = data.filter((r) => r.paid).length;
  return { total, paid, unpaid: total - paid };
});

export const downloadLeadsCsv = createServerFn({ method: "POST" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10000);
  if (error) {
    console.error("downloadLeadsCsv", error);
    return { csv: "", count: 0, error: error.message };
  }
  const headers = ["nome", "telefone", "endereco", "numero", "cep", "amount", "paid", "paid_at", "transaction_id", "created_at"];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const rows = data.map((r) =>
    headers.map((h) => escape((r as Record<string, unknown>)[h])).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const ids = data.map((r) => r.id);
  if (ids.length > 0) {
    const { error: delErr } = await supabaseAdmin.from("leads").delete().in("id", ids);
    if (delErr) console.error("delete after csv", delErr);
  }
  return { csv, count: data.length };
});
