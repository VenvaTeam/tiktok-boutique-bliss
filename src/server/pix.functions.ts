import { createServerFn } from "@tanstack/react-start";

const API_KEY = "sk_live_b3958c20de6c72daced0c31853fa8564b5da7a0dd8cb94912f3b39539d907e5a";

function genCPF(): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calc = (arr: number[]) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i] * (arr.length + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calc(n);
  const d2 = calc([...n, d1]);
  return [...n, d1, d2].join("");
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function genCustomer() {
  const first = ["Joao", "Maria", "Pedro", "Ana", "Lucas", "Camila", "Rafael", "Juliana", "Bruno", "Fernanda"];
  const last = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Rodrigues"];
  const name = `${rand(first)} ${rand(last)}`;
  const email = `${name.toLowerCase().replace(" ", ".")}${Math.floor(Math.random() * 1000)}@gmail.com`;
  const ddd = ["11", "21", "31", "41", "51", "61", "71", "81"];
  const phone = `${rand(ddd)}9${Math.floor(10000000 + Math.random() * 89999999)}`;
  return { name, email, phone, cpf: genCPF() };
}

export const createPixSale = createServerFn({ method: "POST" })
  .inputValidator((d: { amount: number; shipping: { street: string; number: string; zipCode: string } }) => d)
  .handler(async ({ data }) => {
    const c = genCustomer();
    const body = {
      amount: data.amount,
      currency: "BRL",
      paymentMethod: "pix",
      items: [{ title: "Micro-ondas Mondial 21L", unitPrice: data.amount, quantity: 1, tangible: true }],
      customer: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        document: { number: c.cpf, type: "cpf" },
      },
      shipping: {
        name: c.name,
        street: data.shipping.street || "Rua Principal",
        number: data.shipping.number || "100",
        neighborhood: "Centro",
        city: "Porto Alegre",
        state: "RS",
        zipCode: (data.shipping.zipCode || "90010000").replace(/\D/g, ""),
      },
      pix: { expiresInDays: 1 },
    };

    const res = await fetch("https://api.blackcatpay.com.br/api/sales/create-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("Blackcat error", res.status, json);
      return { error: json?.message || "Falha ao gerar Pix", details: json };
    }
    // Try to find pix code in common fields
    const pix = json?.pix || json?.data?.pix || json;
    const qrCode: string | undefined = pix?.qrcode || pix?.qrCode || pix?.copyPaste || pix?.payload || json?.qrcode || json?.qrCode;
    return { qrCode, raw: json };
  });
