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
  // "valor" em reais: enquanto estiver vazio (null), o item aparece como
  // "Valor a confirmar" e a aba do PIX avisa que o valor ainda será informado.
  itens: [
    { id: "sanduicheira",   nome: "Sanduicheira",                   valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "ferro-tabua",    nome: "Ferro de passar roupa e tábua",  valor: null, categoria: "Lavanderia", quantidade: 1 },
    { id: "cortina-sala",   nome: "Cortina da sala",                valor: null, categoria: "Sala",       quantidade: 1 },
    { id: "cortina-quarto", nome: "Cortina do quarto",              valor: null, categoria: "Quarto",     quantidade: 1 },
    { id: "exaustor",       nome: "Exaustor",                       valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "tanquinho",      nome: "Tanquinho",                      valor: null, categoria: "Lavanderia", quantidade: 1 },
    { id: "rack-painel",    nome: "Rack / painel da sala",          valor: null, categoria: "Sala",       quantidade: 1 },
    { id: "tv-50",          nome: "Televisão 50 polegadas",         valor: null, categoria: "Sala",       quantidade: 1 },
    { id: "microondas",     nome: "Micro-ondas",                    valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "filtro-agua",    nome: "Filtro de água",                 valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "cooktop",        nome: "Cooktop",                        valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "forno-eletrico", nome: "Forno elétrico",                 valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "air-fryer",      nome: "Air fryer",                      valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-cama",       nome: "Kit cama (cobertor, forro de cama etc.)", valor: null, categoria: "Quarto", quantidade: 2 },
    { id: "kit-banho",      nome: "Kit banho (toalhas, toalhas de rosto etc.)", valor: null, categoria: "Banheiro", quantidade: 2 },
    { id: "jogo-tapetes",   nome: "Jogo de tapetes (sala, cozinha e banheiro)", valor: null, categoria: "Casa", quantidade: 2 },
    { id: "espelho",        nome: "Espelho",                        valor: null, categoria: "Casa",       quantidade: 2 },
    { id: "climatizador",   nome: "Climatizador",                   valor: null, categoria: "Casa",       quantidade: 1 },
    { id: "jogo-facas",     nome: "Jogo de facas",                  valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-lixeiras",   nome: "Kit lixeiras inox (cozinha, banheiro e área)", valor: null, categoria: "Casa", quantidade: 1 },
    { id: "aspirador",      nome: "Aspirador",                      valor: null, categoria: "Casa",       quantidade: 1 },
    { id: "batedeira",      nome: "Batedeira",                      valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "liquidificador", nome: "Liquidificador",                 valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "cafeteira",      nome: "Cafeteira",                      valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-copos",      nome: "Kit copos",                      valor: null, categoria: "Cozinha",    quantidade: 2 },
    { id: "jogo-pratos",    nome: "Jogo de pratos",                 valor: null, categoria: "Cozinha",    quantidade: 2 },
    { id: "jogo-xicaras",   nome: "Jogo de xícaras",                valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "churrasqueira",  nome: "Churrasqueira elétrica",         valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "panela-pressao", nome: "Panela de pressão",              valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "panela-eletrica",nome: "Panela elétrica",                valor: null, categoria: "Cozinha",    quantidade: 1 },
    { id: "jogo-panelas",   nome: "Jogo de panelas",                valor: null, categoria: "Cozinha",    quantidade: 1 },  ],
};
