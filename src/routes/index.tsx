import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft, Search, Share2, ShoppingCart, MoreHorizontal,
  Bookmark, Star, Truck, Grid2x2, Wallet, Shield, Check,
  Store, MessageCircle, Zap, Ticket, X, ChevronRight, Play,
} from "lucide-react";
import microondas from "@/assets/microondas.png";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import gallery6 from "@/assets/gallery-6.png";
import loiBrasil from "@/assets/loi-brasil.png";
import review1 from "@/assets/review-1.png";
import review2 from "@/assets/review-2.png";
import review3 from "@/assets/review-3.png";
import review4 from "@/assets/review-4.png";
import review5 from "@/assets/review-5.png";
import review6 from "@/assets/review-6.png";
import { Camera } from "lucide-react";

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

const GALLERY = [microondas, gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

function Gallery() {
  return (
    <div className="relative bg-white">
      <div className="flex overflow-x-auto snap-x snap-mandatory aspect-square scrollbar-hide">
        {GALLERY.map((src, i) => (
          <div key={i} className="snap-center shrink-0 w-full h-full flex items-center justify-center">
            <img src={src} alt={`Imagem ${i + 1}`} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span>Vídeo</span>
        <span className="bg-white/25 rounded-full px-1.5">1/{GALLERY.length}</span>
      </div>
    </div>
  );
}

function PriceBanner() {
  return (
    <div className="relative text-white px-3 py-2.5" style={{ background: "linear-gradient(90deg, var(--flash-from), var(--flash-to))" }}>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-end gap-1.5 min-w-0">
          <span className="bg-white text-[color:var(--coupon-fg)] text-[10px] font-bold px-1 py-0.5 rounded shrink-0">-39%</span>
          <span className="text-xs">R$</span>
          <span className="text-[26px] font-bold leading-none">128,32</span>
          <Ticket className="size-3.5 mb-1 shrink-0" />
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 font-semibold text-[13px] whitespace-nowrap"><Zap className="size-3.5 fill-white" />Oferta Relâmpago</div>
          <div className="text-[11px] opacity-95 mt-0.5">Termina em 22:37:54</div>
        </div>
      </div>
      <div className="text-[11px] mt-0.5 line-through opacity-90">R$ 694,11</div>
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
        <span>À vista no Pix </span>
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

import creator1 from "@/assets/creator-1.png";
import creator2 from "@/assets/creator-2.png";
import creator3 from "@/assets/creator-3.png";
import creator4 from "@/assets/creator-4.png";
import creator5 from "@/assets/creator-5.png";
import creator6 from "@/assets/creator-6.png";

const CREATOR_VIDEOS = [creator1, creator2, creator3, creator4, creator5, creator6];

function CreatorVideos() {
  return (
    <div className="bg-background mt-2 px-4 py-3">
      <h2 className="font-semibold text-[16px]">Vídeos de criadores (30+)</h2>
      <div className="flex gap-2 mt-3 overflow-x-auto -mx-4 px-4">
        {CREATOR_VIDEOS.map((src, i) => (
          <div key={i} className="relative w-32 h-44 rounded-lg bg-muted shrink-0 overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <Play className="size-7 text-white/90 fill-white/40 absolute top-2 left-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

type Review = {
  initial: string;
  avatarColor: string;
  name: string;
  variant: string;
  text: string;
  photos: string[];
  totalPhotos: number;
};

const REVIEWS: Review[] = [
  {
    initial: "i",
    avatarColor: "oklch(0.45 0.12 250)",
    name: "i** m**",
    variant: "Preto, 127V",
    text: "Chegou super rápido antes do prazo muito bem embalado funciona perfeitamente pra um soltei…",
    photos: [review1, review2, review3, review4],
    totalPhotos: 6,
  },
  {
    initial: "P",
    avatarColor: "oklch(0.7 0.12 60)",
    name: "P**a K**e",
    variant: "Preto, 220V",
    text: "Muito bom\nLindo …",
    photos: [review2, review5, review6, review3],
    totalPhotos: 5,
  },
];

function Stars({ size = "size-4" }: { size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map(i => (
        <Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const thumbs = r.photos.length;
  const extra = r.totalPhotos - thumbs;
  return (
    <div className="pt-4">
      <div className="flex items-center gap-2">
        <div
          className="size-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
          style={{ background: r.avatarColor }}
        >
          {r.initial}
        </div>
        <span className="font-semibold text-[15px]">{r.name}</span>
      </div>
      <div className="mt-2"><Stars /></div>
      <div className="text-sm text-muted-foreground mt-2">Item: {r.variant}</div>
      <p className="text-[15px] mt-2 whitespace-pre-line leading-snug">{r.text}</p>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {r.photos.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-md bg-muted overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && <Play className="size-7 text-white absolute inset-0 m-auto fill-white/60" />}
            {i === thumbs - 1 && extra > 0 && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-semibold">
                +{extra}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <div className="bg-background mt-2 px-4 py-4 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[16px]">Avaliações dos clientes (271)</h2>
        <button className="text-sm text-muted-foreground flex items-center">
          Ver mais <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[22px] font-bold leading-none">4.8</span>
        <span className="text-sm text-muted-foreground">/5</span>
        <Stars size="size-5" />
      </div>
      {REVIEWS.map((r, i) => <ReviewCard key={i} r={r} />)}
    </div>
  );
}

import store1 from "@/assets/store-1.png";
import store2 from "@/assets/store-2.png";
import store3 from "@/assets/store-3.png";
import store4 from "@/assets/store-4.png";

const STORE_PRODUCTS = [
  { img: store1, price: "A partir de R$...", discount: "-31%" },
  { img: store2, price: "R$ 87,62", discount: "-26%" },
  { img: store3, price: "R$ 469,49", discount: "-63%" },
  { img: store4, price: "R$ 469,49", discount: "-32%" },
];

function StoreProfile() {
  return (
    <div className="bg-background mt-2 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[16px]">Avaliações da loja (14,5 mil)</h2>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex gap-2 mt-3">
        <span className="bg-muted text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5">
          <Camera className="size-4" /> Inclui imagens ou vídeos (2,8 mil)
        </span>
        <span className="bg-muted text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5">
          5 <Star className="size-3.5 fill-yellow-400 text-yellow-400" /> (12,7 mil)
        </span>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
        <img src={loiBrasil} alt="LOi Brasil" loading="lazy" width={56} height={56} className="size-14 rounded-full object-cover" />
        <div className="flex-1">
          <div className="font-semibold text-[16px]">LOi Brasil</div>
          <div className="text-sm text-muted-foreground">74.6K vendido(s)</div>
        </div>
        <button className="bg-muted px-5 py-2 rounded-full text-sm font-medium">Visitar</button>
      </div>
      <div className="mt-3 flex gap-5 text-sm">
        <div><span className="font-bold">76%</span> <span className="text-muted-foreground">responde em 24 horas</span></div>
        <div><span className="font-bold">99%</span> <span className="text-muted-foreground">envios pontuais</span></div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <h3 className="font-medium text-[15px]">Mais desta loja</h3>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto -mx-4 px-4">
        {STORE_PRODUCTS.map((p, i) => (
          <div key={i} className="w-32 shrink-0">
            <div className="aspect-square rounded-lg bg-muted overflow-hidden">
              <img src={p.img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-[15px] mt-2">{p.price}</div>
            <span className="inline-block mt-1 bg-[color:var(--coupon-bg)] text-[color:var(--coupon-fg)] text-xs font-semibold px-1.5 py-0.5 rounded">
              {p.discount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="bg-background mt-2 px-4 py-4 pb-24 space-y-4">
      <h2 className="font-semibold text-[17px]">Sobre este produto</h2>
      <div>
        <h3 className="font-medium text-[15px] mb-2">DESCRIÇÃO RESUMIDA</h3>
        <p className="text-[15px] leading-relaxed">
          Capacidade de 21L; Função Tira Odor: elimina odores internos deixados pelas refeições; Função Descongelar: com apenas 1 toque descongela diversos tipos de alimentos; Função Manter Aquecido: mantém a sua refeição aquecida até o momento de consumi-la; Menu Dia a Dia e Menu Kids: receitas pré-programadas que facilitam o preparo dos alimentos; 10 níveis de potência, Função Relógio, Tecla Iniciar + 30seg e Prato Giratório.
        </p>
      </div>
      <div className="text-[15px] leading-relaxed">
        <div className="font-medium">Características:</div>
        <div>- Marca: Mondial</div>
        <div>- Modelo: MO 01 21 B</div>
      </div>
      <div className="text-[15px] leading-relaxed">
        <div className="font-medium">Especificações:</div>
        {["Voltagem 127v","Cor Preto","Potência 1200W","Consumo 1,2Kw/h","Prato giratório","Tecla iniciar fácil","Tira odor","Descongela","Manter aquecido","Menu dia a dia/menu kids","Função relógio","Níveis de potência 10 níveis","Capacidade 21L","Peso 7Kg"].map(t => <div key={t}>- {t}</div>)}
      </div>
      <div className="rounded-lg overflow-hidden bg-muted mt-3">
        <img src={microondas} alt="Micro-ondas Mondial" loading="lazy" className="w-full object-cover" />
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
        <Link to="/checkout" className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] leading-tight flex flex-col items-center justify-center">
          <span>Comprar</span><span>com cupom</span>
        </Link>
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
      <Reviews />
      <StoreProfile />
      <Description />
      <BottomBar />
    </div>
  );
}
