import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Zap, BadgeCheck, Ticket, Smile } from "lucide-react";
import microondas from "@/assets/microondas.png";
import { useCountdown } from "@/hooks/use-countdown";

type ResumoSearch = { nome: string; endereco: string; cep: string; numero: string };

export const Route = createFileRoute("/resumo")({
  validateSearch: (s: Record<string, unknown>): ResumoSearch => ({
    nome: typeof s.nome === "string" ? s.nome : "",
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
                <div className="text-primary font-bold">R$ 128,32</div>
                <div className="text-xs text-muted-foreground line-through">R$ 426,32 <span className="text-primary no-underline">-70%</span></div>
              </div>
              <div className="flex items-center border border-border rounded-md">
                <button className="w-8 h-8">−</button>
                <span className="w-8 text-center">1</span>
                <button className="w-8 h-8">+</button>
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
          <span>Subtotal do produto</span><span>R$ 128,32</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/80 ml-3">Preço original</span><span>R$ 426,32</span>
        </div>
        <div className="bg-[color:var(--coupon-bg)] -mx-4 px-4 py-2 flex items-center gap-2 text-primary text-sm">
          <Smile className="size-4" /> Você está economizando R$ 298,00 nesse pedido.
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border px-4 pt-3 pb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-bold text-[17px]">Total (1 item)</span>
          <span className="text-primary font-bold text-[20px]">R$ 129,52</span>
        </div>
        <button className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold">
          Fazer pedido
          <div className="text-xs font-normal opacity-90">O cupom expira em {time}</div>
        </button>
      </div>
    </div>
  );
}
