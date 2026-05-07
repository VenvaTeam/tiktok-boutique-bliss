import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Zap, BadgeCheck, Ticket, Smile, Copy, X, Loader2, Check, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import microondas from "@/assets/microondas.png";
import pixLogo from "@/assets/pix-logo.png";
import { useCountdown } from "@/hooks/use-countdown";
import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createPixSale, checkPixStatus } from "@/lib/pix.functions";
import QRCode from "qrcode";
import { toast } from "sonner";

type ResumoSearch = { nome: string; celular: string; endereco: string; cep: string; numero: string };

export const Route = createFileRoute("/resumo")({
  validateSearch: (s: Record<string, unknown>): ResumoSearch => ({
    nome: typeof s.nome === "string" ? s.nome : "",
    celular: typeof s.celular === "string" ? s.celular : "",
    endereco: typeof s.endereco === "string" ? s.endereco : "",
    cep: typeof s.cep === "string" ? s.cep : "",
    numero: typeof s.numero === "string" ? s.numero : "",
  }),
  component: Resumo,
  head: () => ({ meta: [{ title: "Resumo do pedido" }] }),
});

function Resumo() {
  const { nome, endereco, cep, numero } = Route.useSearch();
  const time = useCountdown();
  const createSale = useServerFn(createPixSale);
  const checkStatus = useServerFn(checkPixStatus);
  const [pixOpen, setPixOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrImg, setQrImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [qty, setQty] = useState(1);
  const UNIT = 12832;
  const ORIG = 42632;
  const SHIP = 120;
  const subtotal = UNIT * qty;
  const original = ORIG * qty;
  const discountProd = original - subtotal;
  const totalCents = subtotal + SHIP;
  const fmt = (c: number) => `R$ ${(c / 100).toFixed(2).replace(".", ",")}`;
  const economia = discountProd + 3000 + 3000;

  useEffect(() => {
    if (!txId || paid) return;
    pollRef.current = setInterval(async () => {
      try {
        const r = await checkStatus({ data: { transactionId: txId } });
        if (r.paid) {
          setPaid(true);
          toast.success("Pagamento confirmado!", { description: "Recebemos seu Pix. Obrigado!" });
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {}
    }, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [txId, paid, checkStatus]);

  const handlePay = async () => {
    setPixOpen(true);
    setLoading(true);
    setPaid(false);
    setTxId(null);
    setError(null);
    setPixCode(null);
    setQrImg(null);
    try {
      type SaleRes = { error?: string; qrCode?: string; qrCodeBase64?: string; transactionId?: string };
      const res: SaleRes = await Promise.race([
        createSale({ data: { amount: totalCents } }) as Promise<SaleRes>,
        new Promise<SaleRes>((_, rej) => setTimeout(() => rej(new Error("timeout")), 20000)),
      ]);
      if (res.error || !res.qrCode) {
        const raw = (res.error || "").toLowerCase();
        let friendly = "Não conseguimos gerar seu Pix agora. Tente novamente em instantes.";
        if (raw.includes("expir")) friendly = "Este Pix expirou. Gere um novo para continuar.";
        else if (raw.includes("limit") || raw.includes("rate")) friendly = "Muitas tentativas em sequência. Aguarde alguns segundos e tente de novo.";
        else if (raw.includes("amount") || raw.includes("valor")) friendly = "Valor do pedido inválido. Atualize a página e tente novamente.";
        else if (raw.includes("network") || raw.includes("fetch")) friendly = "Sem conexão com nosso provedor de pagamento. Verifique sua internet.";
        setError(friendly);
        toast.error("Falha ao gerar Pix", { description: friendly });
      } else {
        setPixCode(res.qrCode);
        if (res.transactionId) setTxId(res.transactionId);
        if (res.qrCodeBase64) {
          setQrImg(res.qrCodeBase64);
        } else {
          const img = await QRCode.toDataURL(res.qrCode, { width: 280, margin: 1 });
          setQrImg(img);
        }
      }
    } catch (e) {
      const msg = e instanceof Error && e.message === "timeout"
        ? "O servidor demorou demais para responder. Tente novamente."
        : "Algo deu errado ao gerar seu Pix. Tente novamente.";
      setError(msg);
      toast.error("Falha ao gerar Pix", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!pixCode) return;
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código Pix copiado!", { description: "Cole no app do seu banco para pagar." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-muted/40 pb-32">
      <div className="sticky top-0 z-10 bg-background px-3 pt-3 pb-2 flex items-center gap-2">
        <Link to="/checkout"><ChevronLeft className="size-7" strokeWidth={2.5} /></Link>
        <div className="flex-1 text-center">
          <h1 className="font-bold text-[17px]">Resumo do pedido</h1>
          <div className="text-xs text-[color:var(--teal)] flex items-center justify-center gap-1 mt-0.5">
            <CreditCard className="size-3.5" /> Planos sem juros disponíveis
          </div>
        </div>
        <div className="w-7" />
      </div>

      <div className="bg-background px-4 py-4 flex items-start gap-2">
        <MapPin className="size-5 text-foreground shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold text-[16px]">{nome || "Seu Nome"}</div>
          <div className="text-[15px] text-foreground/80 leading-snug">
            {endereco || "Endereço"}, {numero || "—"}, Porto Alegre, Rio Grande do Sul, {cep || "00000-000"}
          </div>
        </div>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>

      <div className="h-2 bg-[repeating-linear-gradient(90deg,_var(--primary)_0_8px,_transparent_8px_16px,_var(--teal)_16px_24px,_transparent_24px_32px)]" />

      <div className="bg-background mt-2 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[17px]">LOi Brasil</h2>
          <button className="text-sm text-muted-foreground flex items-center">Adicionar nota <ChevronRight className="size-4" /></button>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[color:var(--shield)] text-sm font-medium">
          <BadgeCheck className="size-4 fill-[color:var(--shield)] text-background" />
          Melhor escolha! 1633 vendido(s) e com nota 4.8/5,0
        </div>
        <div className="flex gap-3 mt-3">
          <img src={microondas} alt="" className="size-20 rounded-md object-cover bg-muted" />
          <div className="flex-1">
            <div className="text-[15px] text-muted-foreground line-clamp-1">Micro-ondas Mondial Mo-01-21-b 2…</div>
            <div className="text-sm text-muted-foreground">Preto, 220V</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="size-3 fill-current" /> Oferta Relâmpago
              </span>
              <span className="text-xs">{time}</span>
            </div>
            <div className="text-xs text-[color:var(--shield)] mt-1 flex items-center gap-1">
              <BadgeCheck className="size-3.5" /> Devolução gratuita
            </div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <div className="text-primary font-bold">{fmt(subtotal)}</div>
                <div className="text-xs text-muted-foreground line-through">{fmt(original)} <span className="text-primary no-underline">-70%</span></div>
              </div>
              <div className="flex items-center border border-border rounded-md select-none">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 disabled:opacity-40" disabled={qty <= 1}>−</button>
                <span className="w-8 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))} className="w-8 h-8">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[color:var(--teal-soft)] px-4 py-3 flex items-start justify-between">
        <div>
          <div className="font-medium">Receba em até 48 horas</div>
          <div className="text-sm text-muted-foreground">Envio padrão</div>
        </div>
        <div className="text-right">
          <div className="font-medium">R$ 1,20</div>
          <div className="text-sm text-muted-foreground line-through">R$ 31,20</div>
        </div>
      </div>

      <div className="bg-background mt-2 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="size-5 text-primary" />
          <span className="font-bold text-[16px]">Desconto do TikTok Shop</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="bg-[color:var(--coupon-bg)] text-primary text-sm font-semibold px-2 py-0.5 rounded">- R$ 30,00</span>
          <span className="bg-[color:var(--teal-soft)] text-[color:var(--teal)] text-sm font-semibold px-2 py-0.5 rounded">- R$ 30,00</span>
        </div>
      </div>

      <div className="bg-background mt-2 px-4 py-4 space-y-3">
        <h3 className="font-bold text-[17px]">Resumo do pedido</h3>
        <div className="flex justify-between font-semibold">
          <span>Subtotal do produto</span><span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Preço original</span><span>{fmt(original)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Desconto no produto</span><span className="text-primary">- {fmt(discountProd)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Cupons do TikTok Shop</span><span className="text-primary">- R$ 30,00</span>
        </div>
        <div className="flex justify-between font-semibold pt-1">
          <span>Subtotal do envio</span><span>R$ 1,20</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Taxa de envio</span><span>R$ 31,20</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Desconto de envio</span><span className="text-primary">- R$ 30,00</span>
        </div>
        <div className="bg-[color:var(--coupon-bg)] -mx-4 px-4 py-2 flex items-center gap-2 text-primary text-sm">
          <Smile className="size-4" /> Você está economizando {fmt(economia)} nesse pedido.
        </div>
      </div>

      <div className="bg-background mt-2 px-4 py-4">
        <h3 className="font-bold text-[17px] mb-3">Forma de pagamento</h3>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-md flex items-center justify-center shrink-0">
            <img src={pixLogo} alt="Pix" className="size-9 object-contain" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[16px]">Pix</div>
            <div className="text-sm text-muted-foreground">Efetue o pagamento em até 10 minutos para receber um <span className="font-bold text-primary">BRINDE TORRADEIRA MONDIAL</span> <span className="font-medium">(Parceria TikTok Shop)</span></div>
          </div>
          <div className="size-5 rounded-full border-[6px] border-primary mt-1" />
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border px-4 pt-3 pb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-bold text-[17px]">Total ({qty} {qty === 1 ? "item" : "itens"})</span>
          <span className="text-primary font-bold text-[20px]">{fmt(totalCents)}</span>
        </div>
        <button onClick={handlePay} className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold">
          Fazer pedido
          <div className="text-xs font-normal opacity-90">O cupom expira em {time}</div>
        </button>
      </div>

      {pixOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={pixLogo} alt="Pix" className="size-6" />
                <h3 className="font-bold text-[16px]">Pagar com Pix</h3>
              </div>
              <button onClick={() => setPixOpen(false)} className="p-1"><X className="size-5" /></button>
            </div>
            <div className="p-5">
              {loading && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Gerando seu Pix...</p>
                </div>
              )}
              {!loading && error && (
                <div className="py-8 px-2 flex flex-col items-center text-center">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    {error.toLowerCase().includes("expir") ? (
                      <Clock className="size-6 text-primary" />
                    ) : (
                      <AlertTriangle className="size-6 text-primary" />
                    )}
                  </div>
                  <h4 className="font-semibold text-[16px] mb-1">Não foi possível gerar o Pix</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">{error}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPixOpen(false)} className="h-10 px-5 rounded-full border border-border text-sm font-semibold">Fechar</button>
                    <button onClick={handlePay} className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">Tentar novamente</button>
                  </div>
                </div>
              )}
              {!loading && !error && paid && (
                <div className="py-10 px-2 flex flex-col items-center text-center">
                  <div className="size-16 rounded-full bg-[color:var(--teal-soft)] flex items-center justify-center mb-3">
                    <CheckCircle2 className="size-9 text-[color:var(--teal)]" />
                  </div>
                  <h4 className="font-bold text-[18px] mb-1">Pagamento confirmado!</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">Recebemos seu Pix. Seu pedido já está sendo processado.</p>
                  <button onClick={() => setPixOpen(false)} className="h-10 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">Concluir</button>
                </div>
              )}
              {!loading && !error && !paid && qrImg && (
                <div className="flex flex-col items-center">
                  <div className="text-center mb-3">
                    <div className="text-xs text-muted-foreground">Total a pagar</div>
                    <div className="text-primary font-bold text-[22px]">R$ 129,52</div>
                  </div>
                  <img src={qrImg} alt="QR Code Pix" className="w-56 h-56 rounded-lg border border-border" />
                  <p className="text-xs text-muted-foreground mt-3 text-center">Escaneie o QR Code com o app do seu banco</p>
                  <div className="w-full mt-4">
                    <div className="text-xs font-medium text-foreground/80 mb-1">Pix copia e cola</div>
                    <div className="flex items-stretch gap-2">
                      <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/40 text-xs break-all max-h-20 overflow-y-auto">{pixCode}</div>
                      <button onClick={copy} className="px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1">
                        {copied ? <><Check className="size-4" />Copiado</> : <><Copy className="size-4" />Copiar</>}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 text-center">Após o pagamento, a confirmação é automática.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
