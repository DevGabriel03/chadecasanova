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

  // Tela final depois que a pessoa reserva um presente: vídeo + mensagem de vocês.
  videoObrigado: "videos/obrigado.mp4",
  mensagemObrigado:
    "🎁 Muito obrigado por escolher um presente e por abençoar a nossa história.\n" +
    "Cada detalhe desse novo ciclo fica mais especial com você.\n" +
    "Já estamos contando os dias para comemorar juntos! Estaremos te esperando ✨🥂\n\n" +
    "Gabriel e Cecília 🤵🏽👰🏻‍♀️",

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
  // "valor": média de mercado em reais (Brasília-DF, pesquisa de nov/2026), por unidade.
  // Se ficar null, o item aparece como "Valor a confirmar" e o PIX fica bloqueado.
  // "foto": imagem ilustrativa em fotos/itens/ (troque pelo arquivo que preferir).
  itens: [
    { id: "sanduicheira",   nome: "Sanduicheira",                   valor: 230, foto: "fotos/itens/sanduicheira.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "ferro-tabua",    nome: "Ferro de passar roupa e tábua",  valor: 500, foto: "fotos/itens/ferro-tabua.jpg", categoria: "Lavanderia", quantidade: 1 },
    { id: "cortina-sala",   nome: "Cortina da sala",                valor: 150, foto: "fotos/itens/cortina-sala.jpg", categoria: "Sala",       quantidade: 1 },
    { id: "cortina-quarto", nome: "Cortina do quarto",              valor: 220, foto: "fotos/itens/cortina-quarto.jpg", categoria: "Quarto",     quantidade: 2 },
    { id: "exaustor",       nome: "Exaustor",                       valor: 460, foto: "fotos/itens/exaustor.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "tanquinho",      nome: "Tanquinho",                      valor: 580, foto: "fotos/itens/tanquinho.jpg", categoria: "Lavanderia", quantidade: 1 },
    { id: "rack-painel",    nome: "Rack / painel da sala",          valor: 440, foto: "fotos/itens/rack-painel.jpg", categoria: "Sala",       quantidade: 1 },
    { id: "tv-50",          nome: "Televisão 50 polegadas",         valor: 2030, foto: "fotos/itens/tv-50.jpg", categoria: "Sala",       quantidade: 1 },
    { id: "microondas",     nome: "Micro-ondas",                    valor: 1030, foto: "fotos/itens/microondas.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "filtro-agua",    nome: "Filtro de água",                 valor: 500, foto: "fotos/itens/filtro-agua.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "cooktop",        nome: "Cooktop",                        valor: 700, foto: "fotos/itens/cooktop.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "forno-eletrico", nome: "Forno elétrico",                 valor: 540, foto: "fotos/itens/forno-eletrico.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "air-fryer",      nome: "Air fryer",                      valor: 420, foto: "fotos/itens/air-fryer.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-cama",       nome: "Kit cama (cobertor, forro de cama etc.)", valor: 610, foto: "fotos/itens/kit-cama.jpg", categoria: "Quarto", quantidade: 3 },
    { id: "kit-banho",      nome: "Kit banho (toalhas, toalhas de rosto etc.)", valor: 350, foto: "fotos/itens/kit-banho.jpg", categoria: "Banheiro", quantidade: 3 },
    { id: "jogo-tapetes",   nome: "Jogo de tapetes (sala, cozinha e banheiro)", valor: 200, foto: "fotos/itens/jogo-tapetes.jpg", categoria: "Casa", quantidade: 3 },
    { id: "espelho",        nome: "Espelho",                        valor: 320, foto: "fotos/itens/espelho.jpg", categoria: "Casa",       quantidade: 2 },
    { id: "climatizador",   nome: "Climatizador",                   valor: 1080, foto: "fotos/itens/climatizador.jpg", categoria: "Casa",       quantidade: 1 },
    { id: "jogo-facas",     nome: "Jogo de facas",                  valor: 210, foto: "fotos/itens/jogo-facas.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-lixeiras",   nome: "Kit lixeiras inox (cozinha, banheiro e área)", valor: 250, foto: "fotos/itens/kit-lixeiras.jpg", categoria: "Casa", quantidade: 1 },
    { id: "aspirador",      nome: "Aspirador",                      valor: 830, foto: "fotos/itens/aspirador.jpg", categoria: "Casa",       quantidade: 1 },
    { id: "batedeira",      nome: "Batedeira",                      valor: 360, foto: "fotos/itens/batedeira.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "liquidificador", nome: "Liquidificador",                 valor: 150, foto: "fotos/itens/liquidificador.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "cafeteira",      nome: "Cafeteira",                      valor: 460, foto: "fotos/itens/cafeteira.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "kit-copos",      nome: "Kit copos",                      valor: 70, foto: "fotos/itens/kit-copos.jpg", categoria: "Cozinha",    quantidade: 2 },
    { id: "jogo-pratos",    nome: "Jogo de pratos",                 valor: 540, foto: "fotos/itens/jogo-pratos.jpg", categoria: "Cozinha",    quantidade: 2 },
    { id: "jogo-xicaras",   nome: "Jogo de xícaras",                valor: 150, foto: "fotos/itens/jogo-xicaras.jpg", categoria: "Cozinha",    quantidade: 2 },
    { id: "churrasqueira",  nome: "Churrasqueira elétrica",         valor: 200, foto: "fotos/itens/churrasqueira.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "panela-pressao", nome: "Panela de pressão",              valor: 190, foto: "fotos/itens/panela-pressao.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "panela-eletrica",nome: "Panela elétrica",                valor: 410, foto: "fotos/itens/panela-eletrica.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "jogo-panelas",   nome: "Jogo de panelas",                valor: 310, foto: "fotos/itens/jogo-panelas.jpg", categoria: "Cozinha",    quantidade: 1 },
    { id: "talheres", nome: "Jogo de talheres completo (garfos, facas e colheres)", valor: 80, foto: "fotos/itens/talheres.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "utensilios-silicone", nome: "Kit de utensílios de silicone para cozinha", valor: 110, foto: "fotos/itens/utensilios-silicone.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "potes-vidro", nome: "Kit de potes herméticos de vidro", valor: 200, foto: "fotos/itens/potes-vidro.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "recipientes-plasticos", nome: "Kit de recipientes plásticos para mantimentos", valor: 110, foto: "fotos/itens/recipientes-plasticos.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "assadeiras", nome: "Jogo de assadeiras e formas antiaderentes", valor: 140, foto: "fotos/itens/assadeiras.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "escorredor", nome: "Escorredor de louça em inox", valor: 210, foto: "fotos/itens/escorredor.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "tabua-corte", nome: "Tábua de corte de bambu ou silicone", valor: 70, foto: "fotos/itens/tabua-corte.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "saladeira", nome: "Saladeira com pegadores", valor: 90, foto: "fotos/itens/saladeira.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "jarras", nome: "Kit de jarras de vidro para suco e água", valor: 60, foto: "fotos/itens/jarras.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "panos-prato", nome: "Kit com panos de prato e toalhas de mesa decorativos", valor: 60, foto: "fotos/itens/panos-prato.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "fruteira", nome: "Fruteira de mesa de vidro", valor: 80, foto: "fotos/itens/fruteira.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "boleira", nome: "Boleira com tampa de vidro", valor: 170, foto: "fotos/itens/boleira.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "tacas", nome: "Jogo de taças para água ou vinho", valor: 90, foto: "fotos/itens/tacas.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "petisqueira", nome: "Petisqueira de cerâmica ou madeira", valor: 40, foto: "fotos/itens/petisqueira.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "jogo-americano", nome: "Jogo americano / sousplat para mesa", valor: 70, foto: "fotos/itens/jogo-americano.jpg", categoria: "Cozinha", quantidade: 2 },
    { id: "pegador-conchas", nome: "Pegador de massa e conchas inox", valor: 110, foto: "fotos/itens/pegador-conchas.jpg", categoria: "Cozinha", quantidade: 1 },
    { id: "kit-travesseiros", nome: "Kit de travesseiros macios", valor: 130, foto: "fotos/itens/kit-travesseiros.jpg", categoria: "Quarto", quantidade: 2 },
    { id: "cabides", nome: "Kit de cabides reforçados para guarda-roupa", valor: 50, foto: "fotos/itens/cabides.jpg", categoria: "Quarto", quantidade: 2 },
    { id: "caixas-organizadoras", nome: "Caixas organizadoras dobráveis para armário", valor: 60, foto: "fotos/itens/caixas-organizadoras.jpg", categoria: "Quarto", quantidade: 2 },
    { id: "almofadas", nome: "Kit de almofadas decorativas com capa", valor: 70, foto: "fotos/itens/almofadas.jpg", categoria: "Sala", quantidade: 1 },
    { id: "sofa-retratil", nome: "Sofá retrátil 2 lugares", valor: 1960, foto: "fotos/itens/sofa-retratil.jpg", categoria: "Sala", quantidade: 1 },
    { id: "saboneteira", nome: "Kit saboneteira e porta-escovas para banheiro", valor: 50, foto: "fotos/itens/saboneteira.jpg", categoria: "Banheiro", quantidade: 1 },
    { id: "cestos-roupa", nome: "Cesto para roupa suja", valor: 70, foto: "fotos/itens/cestos-roupa.jpg", categoria: "Lavanderia", quantidade: 1 },
    { id: "varal-chao", nome: "Varal dobrável de chão", valor: 100, foto: "fotos/itens/varal-chao.jpg", categoria: "Lavanderia", quantidade: 1 },
    { id: "mop", nome: "Mop giratório com balde", valor: 80, foto: "fotos/itens/mop.jpg", categoria: "Casa", quantidade: 1 },
    { id: "kit-vassoura", nome: "Kit vassoura, pá de lixo e rodo reforçado", valor: 100, foto: "fotos/itens/kit-vassoura.jpg", categoria: "Casa", quantidade: 1 },
    { id: "escada", nome: "Escada dobrável de 3 ou 4 degraus", valor: 160, foto: "fotos/itens/escada.jpg", categoria: "Casa", quantidade: 1 },
    { id: "caixa-ferramentas", nome: "Caixa de ferramentas básica para casa", valor: 150, foto: "fotos/itens/caixa-ferramentas.jpg", categoria: "Casa", quantidade: 1 },
    { id: "capachos", nome: "Tapetes de entrada / capachos decorativos", valor: 50, foto: "fotos/itens/capachos.jpg", categoria: "Casa", quantidade: 2 },
  ],
};
