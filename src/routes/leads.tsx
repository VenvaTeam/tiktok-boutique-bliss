import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { downloadLeadsCsv, listLeadsStats } from "@/lib/leads.functions";
import { Download, Users, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACCESS_PASSWORD = "Leads1$";
const STORAGE_KEY = "leads_access_ok";

export const Route = createFileRoute("/leads")({
  component: LeadsGate,
  head: () => ({ meta: [{ title: "Leads" }, { name: "robots", content: "noindex" }] }),
});

function LeadsGate() {
  const [ok, setOk] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setOk(true);
    }
  }, []);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pwd === ACCESS_PASSWORD) {
              sessionStorage.setItem(STORAGE_KEY, "1");
              setOk(true);
            } else {
              setErr("Senha incorreta");
            }
          }}
          className="w-full max-w-sm bg-background rounded-xl p-6 border border-border space-y-4"
        >
          <h1 className="text-xl font-bold">Acesso restrito</h1>
          <input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setErr(""); }}
            placeholder="Senha"
            className="w-full h-11 px-3 rounded-lg border border-border bg-background"
          />
          {err && <p className="text-sm text-primary">{err}</p>}
          <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return <LeadsPage />;
}

function LeadsPage() {
  const stats = useServerFn(listLeadsStats);
  const download = useServerFn(downloadLeadsCsv);
  const [data, setData] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const r = await stats();
    setData(r);
  };

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 5000);
    return () => clearInterval(i);
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const r = await download();
      if (!r.csv || r.count === 0) {
        toast.info("Nenhum lead para exportar.");
        return;
      }
      const blob = new Blob(["\ufeff" + r.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${r.count} leads exportados`, { description: "Banco zerado." });
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao baixar CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Users className="size-4" /> Total</div>
            <div className="text-3xl font-bold mt-1">{data.total}</div>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 text-[color:var(--teal)] text-sm"><CheckCircle2 className="size-4" /> Pagaram</div>
            <div className="text-3xl font-bold mt-1 text-[color:var(--teal)]">{data.paid}</div>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 text-primary text-sm"><XCircle className="size-4" /> Não pagaram</div>
            <div className="text-3xl font-bold mt-1 text-primary">{data.unpaid}</div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
          CSV
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Ao baixar, o banco é zerado automaticamente para manter o site leve.
        </p>
      </div>
    </div>
  );
}
