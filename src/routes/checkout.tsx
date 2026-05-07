import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutForm,
  head: () => ({ meta: [{ title: "Dados de entrega" }] }),
});

function CheckoutForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", endereco: "", cep: "", numero: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.nome.trim().length < 2) errs.nome = "Informe seu nome";
    if (form.endereco.trim().length < 3) errs.endereco = "Informe o endereço";
    if (!/^\d{5}-?\d{3}$/.test(form.cep.trim())) errs.cep = "CEP inválido";
    if (!form.numero.trim()) errs.numero = "Informe o número";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    navigate({
      to: "/resumo",
      search: {
        nome: form.nome.trim(),
        endereco: form.endereco.trim(),
        cep: form.cep.trim(),
        numero: form.numero.trim(),
      },
    });
  };

  const field = (label: string, key: keyof typeof form, placeholder: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <input
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        maxLength={120}
        className="mt-1 w-full h-11 px-3 rounded-lg border border-border bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30"
        {...extra}
      />
      {errors[key] && <p className="text-xs text-primary mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-3 pt-3 pb-2 flex items-center gap-2 border-b border-border">
        <Link to="/"><ChevronLeft className="size-7" strokeWidth={2.5} /></Link>
        <h1 className="font-semibold text-[17px]">Endereço de entrega</h1>
      </div>
      <form onSubmit={submit} className="p-4 space-y-4 pb-32">
        <p className="text-sm text-muted-foreground">Preencha seus dados para continuar com a compra.</p>
        {field("Nome completo", "nome", "Ex: Filipe Araújo")}
        {field("Endereço", "endereco", "Ex: Avenida Protásio Alves")}
        {field("CEP", "cep", "00000-000", { inputMode: "numeric", maxLength: 9 })}
        {field("Número", "numero", "Ex: 123", { inputMode: "numeric", maxLength: 10 })}
        <button
          type="submit"
          className="fixed bottom-0 inset-x-0 mx-4 mb-6 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-[15px]"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
