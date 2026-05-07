import { createServerFn } from "@tanstack/react-start";
import { BLACKCAT_API_KEY, genCustomer } from "./pix.server";

export const createPixSale = createServerFn({ method: "POST" })
  .inputValidator((d: { amount: number; shipping: { street: string; number: string; zipCode: string } }) => d)
  .handler(async ({ data }) => {
    const c = genCustomer();
    const body = {
      amount: data.amount,
      currency: "BRL",
      paymentMethod: "pix",
      items: [{ title: "Ebook Promocional", unitPrice: data.amount, quantity: 1, tangible: false }],
      customer: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        document: { number: c.cpf, type: "cpf" },
      },
      pix: { expiresInDays: 1 },
    };

    const res = await fetch("https://api.blackcatpay.com.br/api/sales/create-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": BLACKCAT_API_KEY },
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
