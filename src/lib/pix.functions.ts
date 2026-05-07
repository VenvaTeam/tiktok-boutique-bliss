import { createServerFn } from "@tanstack/react-start";

export const createPixSale = createServerFn({ method: "POST" })
  .inputValidator((d: { amount: number }) => d)
  .handler(async ({ data }) => {
    const API_KEY = "sk_live_b3958c20de6c72daced0c31853fa8564b5da7a0dd8cb94912f3b39539d907e5a";

    const genCPF = (): string => {
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
    };
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const first = ["Joao", "Maria", "Pedro", "Ana", "Lucas", "Camila", "Rafael", "Juliana", "Bruno", "Fernanda"];
    const last = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Rodrigues"];
    const ddd = ["11", "21", "31", "41", "51", "61", "71", "81"];
    const name = `${pick(first)} ${pick(last)}`;
    const email = `${name.toLowerCase().replace(" ", ".")}${Math.floor(Math.random() * 1000)}@gmail.com`;
    const phone = `${pick(ddd)}9${Math.floor(10000000 + Math.random() * 89999999)}`;
    const cpf = genCPF();

    const body = {
      amount: data.amount,
      currency: "BRL",
      paymentMethod: "pix",
      items: [{ title: "Ebook Promocional", unitPrice: data.amount, quantity: 1, tangible: false }],
      customer: { name, email, phone, document: { number: cpf, type: "cpf" } },
      pix: { expiresInDays: 1 },
    };

    const res = await fetch("https://api.blackcatpay.com.br/api/sales/create-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      console.error("Blackcat error", res.status, json);
      return { error: json?.message || json?.error || "Falha ao gerar Pix" };
    }
    const pd = json?.data?.paymentData || json?.paymentData || {};
    const qrCode: string | undefined = pd.qrCode || pd.qrcode || pd.copyPaste || pd.payload;
    const qrCodeBase64: string | undefined = pd.qrCodeBase64;
    if (!qrCode) {
      console.error("No qrCode in response", json);
      return { error: "Resposta sem código Pix" };
    }
    return { qrCode, qrCodeBase64, transactionId: json?.data?.transactionId };
  });

export const checkPixStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { transactionId: string }) => d)
  .handler(async ({ data }) => {
    const API_KEY = "sk_live_b3958c20de6c72daced0c31853fa8564b5da7a0dd8cb94912f3b39539d907e5a";
    try {
      const res = await fetch(`https://api.blackcatpay.com.br/api/sales/${data.transactionId}`, {
        headers: { "X-API-Key": API_KEY },
      });
      const json = await res.json();
      const status: string = (json?.data?.status || json?.status || "").toString().toUpperCase();
      const paid = status === "PAID" || status === "APPROVED" || status === "COMPLETED";
      return { status, paid };
    } catch {
      return { status: "UNKNOWN", paid: false };
    }
  });
