/**
 * Backend do Chá de Casa Nova (Google Apps Script ligado a uma Planilha Google).
 * Cria sozinho as abas "Reservas", "Presenças" e "Contribuições".
 * Quem reservou, CPF e valores ficam só na planilha (privada do dono): o site
 * recebe apenas quantas unidades de cada item já foram reservadas.
 * Para liberar um item de novo, apague a linha da reserva na aba "Reservas".
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
  return String(v == null ? "" : v).slice(0, max || 200);
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
  return resposta({ ok: true });
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
      aba("Presenças").appendRow([agora, texto(d.nome), d.vai === "sim" ? "Sim" : "Não",
        Number(d.pessoas) || 0, texto((d.acompanhantes || []).join(", "), 500),
        texto(d.telefone, 30), texto(d.recado, 500)]);
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
