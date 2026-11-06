/**
 * Backend do Chá de Casa Nova (Google Apps Script ligado a uma Planilha Google).
 * Cria sozinho as abas "Reservas", "Presenças" e "Contribuições".
 * Quem reservou, CPF e valores ficam só na planilha (privada do dono): o site
 * recebe apenas quantas unidades de cada item já foram reservadas.
 * Para liberar um item de novo, apague a linha da reserva na aba "Reservas"
 * ou use o Painel do anfitrião (arquivo Admin.html, só abre para a conta DONO).
 */

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
        texto(d.nome), "'" + cpf, d.forma === "pix" ? "PIX" : "Leva no dia"]);
      return resposta({ ok: true, reservas: lerReservas() });
    }

    if (d.acao === "presenca") {
      // WhatsApp: vazio ou exatamente 11 números (DDD + 9 dígitos)
      const tel = String(d.telefone || "").replace(/\D/g, "");
      if (tel && tel.length !== 11) return resposta({ ok: false, erro: "telefone" });
      aba("Presenças").appendRow([agora, texto(d.nome), d.vai === "sim" ? "Sim" : "Não",
        Number(d.pessoas) || 0, texto((d.acompanhantes || []).join(", "), 500),
        tel ? "'" + tel : "", texto(d.recado, 500)]);
      return resposta({ ok: true });
    }

    if (d.acao === "contribuicao") {
      aba("Contribuições").appendRow([agora, texto(d.nome), Number(d.valor) || 0, texto(d.recado, 500)]);
      return resposta({ ok: true });
    }

    return resposta({ ok: false, erro: "acao" });
  } catch (err) {
    return resposta({ ok: false, erro: "servidor" });
  } finally {
    trava.releaseLock();
  }
}
