import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft, Search, Share2, ShoppingCart, MoreHorizontal,
  Bookmark, Star, Truck, Grid2x2, Wallet, Shield, Check,
  Store, MessageCircle, Zap, Ticket, X, ChevronRight, Play,
} from "lucide-react";
import microondas from "@/assets/microondas.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [{ title: "Micro-ondas Mondial — TikTok Shop" }] }),
});

function TopBar() {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur px-3 pt-3 pb-2 flex items-center gap-2">
      <ChevronLeft className="size-7 shrink-0" strokeWidth={2.5} />
      <div className="flex-1 h-9 rounded-full bg-muted flex items-center px-3 gap-2">
        <Search className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground truncate">microondas consul...</span>
      </div>
      <Share2 className="size-6 shrink-0" strokeWidth={2.2} />
      <ShoppingCart className="size-6 shrink-0" strokeWidth={2.2} />
      <MoreHorizontal className="size-6 shrink-0" strokeWidth={2.2} />
    </div>
  );
}

function Tabs() {
  const tabs = ["Visão geral", "Avaliações", "Descrição", "Recome"];
  return (
    <div className="flex gap-6 px-4 border-b border-border overflow-x-auto">
      {tabs.map((t, i) => (
        <button key={t} className={`py-3 text-[15px] whitespace-nowrap relative ${i === 0 ? "font-bold text-foreground" : "text-foreground/70"}`}>
          {t}
          {i === 0 && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-foreground rounded-full" />}
        </button>
      ))}
    </div>
  );
}

function Gallery() {
  return (
    <div className="relative bg-white">
      <div className="aspect-square flex items-center justify-center">
        <img src={microondas} alt="Micro-ondas Mondial" className="max-h-full max-w-full object-contain" />
      </div>
      <div className="absolute bottom-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span>Vídeo</span>
        <span className="bg-white/25 rounded-full px-1.5">1/9</span>
      </div>
    </div>
  );
}

function PriceBanner() {
  return (
    <div className="relative text-white px-4 py-3" style={{ background: "linear-gradient(90deg, var(--flash-from), var(--flash-to))" }}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-2">
          <span className="bg-white text-[color:var(--coupon-fg)] text-xs font-bold px-1.5 py-0.5 rounded">-39%</span>
          <span className="text-sm">R$</span>
          <span className="text-3xl font-bold leading-none">426,32</span>
          <Ticket className="size-4 mb-1" />
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 font-semibold text-[15px]"><Zap className="size-4 fill-white" />Oferta Relâmpago</div>
          <div className="text-xs opacity-95 mt-0.5">Termina em 22:37:54</div>
        </div>
      </div>
      <div className="text-xs/none mt-1 line-through opacity-90">R$ 694,11</div>
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
      <div className="text-muted-foreground shrink-0">{icon}</div>
      <div className="flex-1 text-[15px]">{children}</div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </div>
  );
}

function ProductInfo() {
  return (
    <div className="bg-background">
      <Row icon={<Wallet className="size-5" />}>
        <span>5x R$ 85,26 </span>
        <span className="text-[color:var(--coupon-fg)] font-semibold">sem juros</span>
      </Row>
      <Row icon={<Ticket className="size-5 text-[color:var(--coupon-fg)]" />}>
        <span className="text-[color:var(--coupon-fg)] font-semibold">Desconto de R$ 30</span>
      </Row>
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start gap-2">
          <span className="bg-[color:var(--coupon-bg)] text-[color:var(--coupon-fg)] text-xs font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">5.5</span>
          <h1 className="text-[17px] font-medium leading-snug flex-1">Micro-ondas Mondial Mo-01-21-b 21 Litros</h1>
          <Bookmark className="size-5 text-muted-foreground shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm">
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">4.8</span>
          <span className="text-accent">(271)</span>
          <span className="text-muted-foreground">| 11.6K vendidos on-line</span>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="bg-background mt-2">
      <Tabs />
      <Row icon={<Truck className="size-5" />}>
        <div className="font-medium">Receba até 11–14 de mai</div>
        <div className="text-sm text-muted-foreground mt-0.5">
          Taxa de envio: <span className="line-through">R$ 31,20</span> R$ 1,20
        </div>
        <div className="text-sm text-[color:var(--teal)] mt-1">Desconto de R$ 30 no frete em pedidos acima de R$ 59</div>
      </Row>
      <Row icon={<Grid2x2 className="size-5" />}>2 opções disponíveis</Row>
      <Row icon={<Wallet className="size-5" />}>
        Bônus de cashback de <span className="text-[color:var(--shield)] font-semibold">2%</span>
      </Row>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-[color:var(--shield)] font-semibold">
          <Shield className="size-5" /> Proteção do cliente
          <ChevronRight className="size-4 ml-auto text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 text-sm">
          {["Devolução gratuita","Reembolso se algo der errado","Pagamento seguro","Se o seu pedido não for enviad"].map(t => (
            <div key={t} className="flex items-start gap-1.5">
              <Check className="size-4 text-[color:var(--shield)] shrink-0 mt-0.5" /><span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Offers() {
  return (
    <div className="bg-background mt-2 px-4 py-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[16px]">Ofertas</h2>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex gap-3 mt-3 overflow-x-auto -mx-4 px-4 pb-1">
        {[1,2].map(i => (
          <div key={i} className="bg-[color:var(--teal-soft)] rounded-xl p-3 min-w-[88%] flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-[15px]">Cupom de envio</div>
              <div className="text-xs text-muted-foreground mt-1">Desconto de R$ 10 no frete em pedidos acima de R$ 9</div>
            </div>
            <div className="relative">
              <button className="bg-[color:var(--teal)] text-white text-sm font-semibold px-4 py-1.5 rounded-md">Resgatar</button>
              <span className="absolute -top-2 -right-1 bg-[color:var(--teal)] text-white text-[10px] px-1.5 rounded-full">x3</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorVideos() {
  return (
    <div className="bg-background mt-2 px-4 py-3 pb-24">
      <h2 className="font-semibold text-[16px]">Vídeos de criadores (30+)</h2>
      <div className="flex gap-2 mt-3 overflow-x-auto -mx-4 px-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="relative w-32 h-44 rounded-lg bg-muted shrink-0 overflow-hidden flex items-center justify-center">
            <Play className="size-7 text-white/90 fill-white/40 absolute top-2 left-2" />
            <img src={microondas} alt="" className="w-full h-full object-cover opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CouponBar() {
  return (
    <div className="bg-[color:var(--coupon-bg)] px-4 py-2.5 flex items-center gap-2 text-sm">
      <Zap className="size-4 text-[color:var(--coupon-fg)] fill-[color:var(--coupon-fg)]" />
      <span className="flex-1">
        <span className="text-[color:var(--coupon-fg)] font-semibold">O cupom de R$30</span> de desconto está expirando
      </span>
      <span className="text-[color:var(--coupon-fg)] font-semibold">22:37:54</span>
      <X className="size-4 text-muted-foreground" />
    </div>
  );
}

function BottomBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border">
      <CouponBar />
      <div className="flex items-center gap-2 px-3 py-2">
        <button className="flex flex-col items-center text-[11px] px-1">
          <Store className="size-5" /><span>Loja</span>
        </button>
        <button className="flex flex-col items-center text-[11px] px-1">
          <MessageCircle className="size-5" /><span>Chat</span>
        </button>
        <button className="flex-1 h-12 rounded-full bg-muted font-semibold text-[15px] leading-tight">
          Adicionar<br/>ao carrinho
        </button>
        <button className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] leading-tight">
          Comprar<br/>com cupom
        </button>
      </div>
      <div className="h-1.5 mx-auto w-32 bg-foreground rounded-full mb-1.5" />
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-muted max-w-[440px] mx-auto">
      <TopBar />
      <Gallery />
      <PriceBanner />
      <ProductInfo />
      <Overview />
      <Offers />
      <CreatorVideos />
      <BottomBar />
    </div>
  );
}
