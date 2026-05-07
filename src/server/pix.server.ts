export const BLACKCAT_API_KEY = "sk_live_b3958c20de6c72daced0c31853fa8564b5da7a0dd8cb94912f3b39539d907e5a";

export function genCPF(): string {
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

export function genCustomer() {
  const first = ["Joao", "Maria", "Pedro", "Ana", "Lucas", "Camila", "Rafael", "Juliana", "Bruno", "Fernanda"];
  const last = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Rodrigues"];
  const name = `${rand(first)} ${rand(last)}`;
  const email = `${name.toLowerCase().replace(" ", ".")}${Math.floor(Math.random() * 1000)}@gmail.com`;
  const ddd = ["11", "21", "31", "41", "51", "61", "71", "81"];
  const phone = `${rand(ddd)}9${Math.floor(10000000 + Math.random() * 89999999)}`;
  return { name, email, phone, cpf: genCPF() };
}
