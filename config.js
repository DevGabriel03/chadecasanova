// =====================================================================
//  CONFIGURAÇÃO DO CHÁ DE CASA NOVA
//  Troque os textos de exemplo abaixo pelos seus dados. Só este arquivo
//  precisa ser editado para mudar evento, endereço, PIX e lista de itens.
// =====================================================================
window.CONFIG = {
  titulo: "Chá de Casa Nova",
  anfitrioes: "Gabriel & Cecília",                // aparece embaixo do título
  recado:
    "Iniciamos o capítulo mais bonito da nossa história e, para celebrar essa nova fase " +
    "do nosso casamento, queremos reunir quem mais amamos.\n" +
    "Sua presença é essencial para abençoar o nosso lar. E, para nos ajudar a deixar cada " +
    "cantinho com a nossa cara, preparamos uma lista de presentes cheia de carinho!",

  // Data no formato AAAA-MM-DD e hora HH:MM (usados na contagem regressiva)
  data: "2026-12-13",
  hora: "12:00",
  dataTexto: "Domingo, 13 de dezembro de 2026",
  horaTexto: "a partir das 12h",
  confirmarAte: "1º de dezembro",

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
  valoresSimbolicos: [100, 200, 300, 500],

  // Endereço do Google Apps Script (veja LEIA-ME.md). Enquanto estiver
  // vazio, o site roda em MODO DE TESTE e guarda tudo só no seu navegador.
  API_URL: "https://script.google.com/macros/s/AKfycbw9itglRRmKhVtwI0jWliLQulBS47tXRQ6Kq4n6osaMdBKR7rfyw7ykvhQg_yDao83Xkw/exec",
  // Painel do anfitrião: só abre para a conta Google dos anfitriões.
  PAINEL_URL: "https://script.google.com/macros/s/AKfycbxMckoZeiGvltZEJPNuSjAxQFkp73QAGKXYuNk1k4__SeqdRljJOeaZEeCMr0JyA0fhnA/exec",

  // Lista de presentes. "id" precisa ser único e não deve mudar depois que
  // alguém reservar. "quantidade" é quantas unidades você precisa.
  // Opcionais, para a aba "Modelo que queremos" de cada item:
  //   link:   endereço da loja do modelo de preferência de vocês
  //   modelo: nome do modelo, por exemplo "Fogão 5 bocas Brastemp inox"
  // Sem "link", a aba avisa que o modelo ainda será indicado.
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
