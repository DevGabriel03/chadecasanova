/**
 * Backend do Chá de Casa Nova (Google Apps Script ligado a uma Planilha Google).
 * Cria sozinho as abas "Reservas", "Presenças" e "Contribuições".
 * Quem reservou, CPF e valores ficam só na planilha (privada do dono): o site
 * recebe apenas quantas unidades de cada item já foram reservadas.
 * Para liberar um item de novo, apague a linha da reserva na aba "Reservas"
 * ou use o Painel do anfitrião (arquivo Admin.html, só abre para a conta DONO).
 */

// PASSO ÚNICO DE CONFIGURAÇÃO: esta função fica no topo para já vir selecionada no editor.
// Clique em "Executar" e permita o envio de e-mail; um aviso de teste chega no seu celular.
function testarAviso() {
  MailApp.sendEmail({
    to: DONO,
    subject: "✅ Teste: avisos do Chá de Casa Nova funcionando",
    body: "Se você recebeu esta mensagem, os avisos de confirmação de presença vão chegar aqui.\n\nPainel do anfitrião: " + URL_PAINEL,
    name: "Chá de Casa Nova",
  });
}

// Como a pessoa vai presentear (aba escolhida no site)
const FORMAS = {
  modelo: "Leva o modelo indicado",
  pix: "PIX",
  livre: "Leva de sua preferência",
};

const ABAS = {
  Reservas: ["Data", "ID do item", "Item", "Valor", "Nome", "CPF", "Forma"],
  "Presenças": ["Data", "Nome", "Vem?", "Pessoas", "Acompanhantes", "WhatsApp", "Recado"],
  "Contribuições": ["Data", "Nome", "Valor", "Recado"],
};

function aba(nome) {
  const pl = SpreadsheetApp.getActiveSpreadsheet();
  let a = pl.getSheetByName(nome);
  if (!a) {
    a = pl.insertSheet(nome);
    a.appendRow(ABAS[nome]);
    a.setFrozenRows(1);
    a.getRange(1, 1, 1, ABAS[nome].length).setFontWeight("bold");
  }
  return a;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function texto(v, max) {
  const s = String(v == null ? "" : v).slice(0, max || 200);
  // impede que um convidado grave uma fórmula (ex.: "=IMPORTXML(...)") na planilha
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function lerReservas() {
  const linhas = aba("Reservas").getDataRange().getValues().slice(1);
  const mapa = {};
  linhas.forEach((l) => {
    const id = l[1];
    if (!id) return;
    // só a quantidade sai da planilha: nomes, CPFs e valores ficam com o dono
    mapa[id] = (mapa[id] || 0) + 1;
  });
  return mapa;
}

function doGet(e) {
  if (e.parameter.acao === "status") return resposta({ ok: true, reservas: lerReservas() });
  // Sem "acao": é o Painel do anfitrião. Só abre para a conta Google do dono.
  if (!ehDono()) {
    return HtmlService.createHtmlOutput(
      '<p style="font:16px system-ui;padding:24px">Acesso restrito aos anfitriões.</p>')
      .setTitle("Acesso restrito");
  }
  return HtmlService.createHtmlOutputFromFile("Admin")
    .setTitle("Painel do anfitrião – Chá de Casa Nova")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// ------------------------------------------------------------------ painel do anfitrião
const DONO = "gabigol1922@gmail.com";

// Confere quem está logado no Google. Visitantes anônimos ou de outras contas
// recebem "" do Google, então só o dono passa.
function ehDono() {
  try {
    const email = String(Session.getActiveUser().getEmail() || "").toLowerCase();
    return email === DONO;
  } catch (err) {
    return false;
  }
}

function exigirDono() {
  if (!ehDono()) throw new Error("Acesso restrito aos anfitriões.");
}

// Lê uma aba como lista de objetos, guardando o número da linha para excluir depois.
function linhas(nome) {
  const valores = aba(nome).getDataRange().getValues();
  const cab = valores[0];
  return valores.slice(1).map((l, i) => {
    const o = { linha: i + 2 };
    cab.forEach((c, j) => (o[c] = l[j] instanceof Date ? l[j].toISOString() : l[j]));
    return o;
  }).filter((o) => o[cab[1]] !== "");
}

function dadosAdmin() {
  exigirDono();
  return {
    presencas: linhas("Presenças"),
    reservas: linhas("Reservas"),
    contribuicoes: linhas("Contribuições"),
    planilha: SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    agora: new Date().toISOString(),
  };
}

// Exclui uma linha, conferindo antes se ela ainda é a mesma (data + nome).
function excluirLinha(nomeAba, linha, data, nome) {
  exigirDono();
  if (!ABAS[nomeAba]) throw new Error("Aba inválida.");
  const trava = LockService.getScriptLock();
  trava.waitLock(15000);
  try {
    const a = aba(nomeAba);
    if (linha < 2 || linha > a.getLastRow()) throw new Error("Esse registro não existe mais. Atualize o painel.");
    const l = a.getRange(linha, 1, 1, a.getLastColumn()).getValues()[0];
    const dataLinha = l[0] instanceof Date ? l[0].toISOString() : String(l[0]);
    const nomeLinha = nomeAba === "Reservas" ? l[4] : l[1];
    if (dataLinha !== data || String(nomeLinha) !== String(nome)) {
      throw new Error("A planilha mudou desde que o painel foi aberto. Atualize e tente de novo.");
    }
    a.deleteRow(linha);
    return dadosAdmin();
  } finally {
    trava.releaseLock();
  }
}

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const agora = new Date();

    if (d.acao === "reservar") {
      const cpf = texto(d.cpf, 11).replace(/\D/g, "");
      if (!d.itemId || !d.nome || cpf.length !== 11) return resposta({ ok: false, erro: "dados" });
      const atuais = lerReservas()[d.itemId] || 0;
      if (atuais >= Number(d.limite || 1)) return resposta({ ok: false, erro: "esgotado" });
      // "'" na frente mantém os zeros à esquerda do CPF
      aba("Reservas").appendRow([agora, texto(d.itemId, 60), texto(d.item), Number(d.valor) || 0,
        texto(d.nome), "'" + cpf, FORMAS[d.forma] || "Leva no dia"]);
      avisarReserva(d);
      return resposta({ ok: true, reservas: lerReservas() });
    }

    if (d.acao === "presenca") {
      // WhatsApp: vazio ou celular brasileiro (DDD 11-99 + 9 + 8 dígitos)
      const tel = String(d.telefone || "").replace(/\D/g, "");
      if (tel && !/^[1-9][1-9]9\d{8}$/.test(tel)) return resposta({ ok: false, erro: "telefone" });
      aba("Presenças").appendRow([agora, texto(d.nome), d.vai === "sim" ? "Sim" : "Não",
        Number(d.pessoas) || 0, texto((d.acompanhantes || []).join(", "), 500),
        tel ? "'" + tel : "", texto(d.recado, 500)]);
      avisarPresenca(d, tel);
      return resposta({ ok: true });
    }

    if (d.acao === "contribuicao") {
      aba("Contribuições").appendRow([agora, texto(d.nome), Number(d.valor) || 0, texto(d.recado, 500)]);
      avisarContribuicao(d);
      return resposta({ ok: true });
    }

    return resposta({ ok: false, erro: "acao" });
  } catch (err) {
    return resposta({ ok: false, erro: "servidor" });
  } finally {
    trava.releaseLock();
  }
}

// ------------------------------------------------------------------ aviso no celular
// A cada confirmação de presença, manda um e-mail para o dono. No celular, ele chega como
// notificação do app do Gmail. Se o envio falhar, a confirmação do convidado não é afetada.
const URL_PAINEL = "https://script.google.com/macros/s/AKfycbxMckoZeiGvltZEJPNuSjAxQFkp73QAGKXYuNk1k4__SeqdRljJOeaZEeCMr0JyA0fhnA/exec";

// texto de convidado em uma linha só, para não bagunçar o assunto do e-mail
function umaLinha(v, max) {
  return String(v == null ? "" : v).replace(/[\r\n\t]+/g, " ").trim().slice(0, max || 200);
}

function avisarPresenca(d, tel) {
  try {
    const vem = d.vai === "sim";
    const nome = umaLinha(d.nome, 80);
    const pessoas = Number(d.pessoas) || 0;
    // total de confirmados até agora (soma a coluna "Pessoas" das linhas com "Sim")
    const linhas = aba("Presenças").getDataRange().getValues().slice(1);
    const total = linhas.filter((l) => l[2] === "Sim").reduce((s, l) => s + (Number(l[3]) || 1), 0);
    const assunto = vem
      ? "✅ Presença confirmada: " + nome + " (" + pessoas + (pessoas === 1 ? " pessoa)" : " pessoas)")
      : "❌ Não vai poder ir: " + nome;
    const corpo = [
      vem ? "Chegou uma nova confirmação de presença!" : "Um convidado avisou que não vai poder ir.",
      "",
      "Nome: " + nome,
      vem ? "Pessoas: " + pessoas : "",
      vem && d.acompanhantes && d.acompanhantes.length ? "Acompanhantes: " + umaLinha(d.acompanhantes.join(", "), 300) : "",
      tel ? "WhatsApp: " + tel : "",
      d.recado ? "Recado: " + umaLinha(d.recado, 500) : "",
      "",
      "Total confirmado até agora: " + total + (total === 1 ? " pessoa" : " pessoas"),
      "",
      "Painel do anfitrião: " + URL_PAINEL,
    ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0)).join("\n");
    MailApp.sendEmail({ to: DONO, subject: assunto, body: corpo, name: "Chá de Casa Nova" });
  } catch (err) {
    // sem aviso por e-mail (por exemplo, limite diário de envios): a confirmação já foi salva
  }
}

const brl = (v) => "R$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Reservou um presente (o CPF não vai no e-mail; fica só na planilha)
function avisarReserva(d) {
  try {
    const nome = umaLinha(d.nome, 80), item = umaLinha(d.item, 100);
    const forma = FORMAS[d.forma] || "Leva no dia";
    const valor = Number(d.valor) || 0;
    const reservadas = lerReservas()[d.itemId] || 0, limite = Number(d.limite) || 1;
    const assunto = "🎁 Presente reservado: " + item + " — " + nome;
    const corpo = [
      "Alguém acabou de escolher um presente!",
      "",
      "Presente: " + item,
      "Quem escolheu: " + nome,
      "Como: " + forma + (d.forma === "pix" && valor ? " (" + brl(valor) + ")" : ""),
      limite > 1 ? "Unidades reservadas: " + reservadas + " de " + limite : "",
      "",
      "Painel do anfitrião: " + URL_PAINEL,
    ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0)).join("\n");
    MailApp.sendEmail({ to: DONO, subject: assunto, body: corpo, name: "Chá de Casa Nova" });
  } catch (err) {}
}

// Avisou que enviou um valor por PIX (aba "Ajudar com um valor")
function avisarContribuicao(d) {
  try {
    const nome = umaLinha(d.nome, 80), valor = Number(d.valor) || 0;
    const assunto = "💙 PIX avisado: " + brl(valor) + " — " + nome;
    const corpo = [
      "Alguém avisou que enviou um PIX!",
      "",
      "Quem: " + nome,
      "Valor: " + brl(valor),
      d.recado ? "Recado: " + umaLinha(d.recado, 500) : "",
      "",
      "Confira o valor no app do seu banco e no Painel do anfitrião: " + URL_PAINEL,
    ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0)).join("\n");
    MailApp.sendEmail({ to: DONO, subject: assunto, body: corpo, name: "Chá de Casa Nova" });
  } catch (err) {}
}