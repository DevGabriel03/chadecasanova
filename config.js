// =====================================================================
//  CONFIGURAÇÃO DO CHÁ DE CASA NOVA
//  Troque os textos de exemplo abaixo pelos seus dados. Só este arquivo
//  precisa ser editado para mudar evento, endereço, PIX e lista de itens.
// =====================================================================
window.CONFIG = {
  titulo: "Chá de Casa Nova",
  anfitrioes: "Gabriel & Cecília",                // aparece embaixo do título
  recado:
    "Mudamos! Queremos comemorar o nosso novo cantinho com quem a gente ama. " +
    "Confirme sua presença e, se quiser, escolha um presente da lista.",

  // Data no formato AAAA-MM-DD e hora HH:MM (usados na contagem regressiva)
  data: "2026-12-13",
  hora: "12:00",
  dataTexto: "Domingo, 13 de dezembro de 2026",
  horaTexto: "a partir das 12h",
  confirmarAte: "10 de dezembro",

  // Campos vazios não aparecem no site.
  endereco: {
    nome: "Chácara Dois Rios – Novo",
    rua: "",
    bairro: "Núcleo Rural Ponte Alta, perto da DF-180",
    cidade: "Gama – DF",
    cep: "",
    referencia: "",
  },
  // Ponto exato do local (do link de compartilhamento do Google Maps).
  coordenadas: "-15.9959355,-48.1101599",
  linkMaps: "https://maps.app.goo.gl/x8QdaQ1C8HitvWYG8",
  mapsBusca: "Chácara Dois Rios - Novo",

  // PIX: chave (CPF só números, e-mail, celular no formato +5511999999999
  // ou chave aleatória), nome do titular e cidade, como aparecem no banco.
  pix: {
    chave: "+5561983054422",          // formato que vai dentro do QR Code
    chaveCopiar: "61983054422",       // o que o botão "Copiar chave" copia
    chaveExibir: "(61) 98305-4422",   // como a chave aparece escrita
    tipo: "Celular",
    nome: "GABRIEL E CECILIA",
    cidade: "BRASILIA",
    banco: "",
  },

  // Aba "Ajudar com um valor": valor mínimo aceito e valores sugeridos
  valorMinimo: 100,
  valoresSimbolicos: [100, 150, 200, 300],

  // Endereço do Google Apps Script (veja LEIA-ME.md). Enquanto estiver
  // vazio, o site roda em MODO DE TESTE e guarda tudo só no seu navegador.
  API_URL: "https://script.google.com/macros/s/AKfycbw9itglRRmKhVtwI0jWliLQulBS47tXRQ6Kq4n6osaMdBKR7rfyw7ykvhQg_yDao83Xkw/exec",
  // Painel do anfitrião: só abre para a conta Google dos anfitriões.
  PAINEL_URL: "https://script.google.com/macros/s/AKfycbxMckoZeiGvltZEJPNuSjAxQFkp73QAGKXYuNk1k4__SeqdRljJOeaZEeCMr0JyA0fhnA/exec",

  // Lista de presentes. "id" precisa ser único e não deve mudar depois que
  // alguém reservar. "quantidade" é quantas unidades você precisa.
  itens: [
    { id: "panelas",       nome: "Jogo de panelas antiaderente", valor: 350, categoria: "Cozinha",   quantidade: 1 },
    { id: "copos",         nome: "Jogo de 6 copos de vidro",     valor: 60,  categoria: "Cozinha",   quantidade: 2 },
    { id: "talheres",      nome: "Faqueiro 24 peças",            valor: 120, categoria: "Cozinha",   quantidade: 1 },
    { id: "airfryer",      nome: "Air fryer",                    valor: 450, categoria: "Eletro",    quantidade: 1 },
    { id: "liquidificador",nome: "Liquidificador",               valor: 180, categoria: "Eletro",    quantidade: 1 },
    { id: "toalhas",       nome: "Jogo de toalhas de banho",     valor: 140, categoria: "Banheiro",  quantidade: 1 },
    { id: "tapete-banho",  nome: "Tapete de banheiro",           valor: 45,  categoria: "Banheiro",  quantidade: 2 },
    { id: "lencol",        nome: "Jogo de lençol casal",         valor: 160, categoria: "Quarto",    quantidade: 1 },
    { id: "travesseiros",  nome: "Par de travesseiros",          valor: 110, categoria: "Quarto",    quantidade: 1 },
    { id: "potes",         nome: "Kit de potes herméticos",      valor: 90,  categoria: "Cozinha",   quantidade: 1 },
    { id: "vassoura",      nome: "Kit limpeza (vassoura, rodo e balde)", valor: 80, categoria: "Lavanderia", quantidade: 1 },
    { id: "varal",         nome: "Varal de chão",                valor: 120, categoria: "Lavanderia",quantidade: 1 },
  ],
};
