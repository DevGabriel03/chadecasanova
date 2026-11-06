(() => {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const brl = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const DEMO = !C.API_URL;
  const ABAS = ["evento", "presenca", "presentes", "contribuir", "local"];

  let reservas = {};          // itemId -> [{ nome, forma }]
  let categoria = "Todos";
  let itemAtual = null;

  // ---------------------------------------------------------------- dados
  function lerDemo() {
    try { return JSON.parse(localStorage.getItem("cha-demo")) || { reservas: {} }; }
    catch { return { reservas: {} }; }
  }
  function gravarDemo(d) { try { localStorage.setItem("cha-demo", JSON.stringify(d)); } catch {} }

  async function buscarReservas() {
    if (DEMO) return lerDemo().reservas;
    const r = await fetch(C.API_URL + "?acao=status", { cache: "no-store" });
    const j = await r.json();
    if (!j.ok) throw new Error(j.erro || "Falha ao carregar");
    return j.reservas || {};
  }

  async function enviar(dados) {
    if (DEMO) {
      const d = lerDemo();
      if (dados.acao === "reservar") {
        const feitos = contagem(d.reservas[dados.itemId]);
        if (feitos >= dados.limite) return { ok: false, erro: "esgotado" };
        d.reservas[dados.itemId] = feitos + 1;
        gravarDemo(d);
        return { ok: true, reservas: d.reservas };
      }
      return { ok: true };
    }
    const r = await fetch(C.API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita bloqueio de CORS no Apps Script
      body: JSON.stringify(dados),
    });
    return r.json();
  }

  // ---------------------------------------------------------------- utilidades
  const primeiroNome = (n) => n.trim().split(/\s+/)[0];
  // O site só recebe quantas unidades de cada item já foram reservadas; quem
  // reservou fica só na planilha. (Aceita a lista antiga por compatibilidade.)
  const contagem = (v) => (typeof v === "number" ? v : Array.isArray(v) ? v.length : 0);

  function cpfValido(cpf) {
    const c = cpf.replace(/\D/g, "");
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
    for (let t = 9; t < 11; t++) {
      let s = 0;
      for (let i = 0; i < t; i++) s += Number(c[i]) * (t + 1 - i);
      if (((s * 10) % 11) % 10 !== Number(c[t])) return false;
    }
    return true;
  }
  // Celular brasileiro: DDD (11 a 99) + 9 + 8 dígitos = 11 números, mostrado como (61) 98305-4422
  const telefoneValido = (d) => /^[1-9][1-9]9\d{8}$/.test(d);
  function mascaraTel(v) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  function mascaraCpf(v) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // PIX "copia e cola" (BR Code do Banco Central) com valor
  const campo = (id, v) => id + String(v.length).padStart(2, "0") + v;
  const limpa = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().trim();
  function crc16(s) {
    let c = 0xffff;
    for (let i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) c = c & 0x8000 ? (c << 1) ^ 0x1021 : c << 1;
      c &= 0xffff;
    }
    return c.toString(16).toUpperCase().padStart(4, "0");
  }
  function pixCodigo(valor) {
    const conta = campo("00", "br.gov.bcb.pix") + campo("01", C.pix.chave.trim());
    let p = campo("00", "01") + campo("26", conta) + campo("52", "0000") + campo("53", "986") +
      (valor ? campo("54", Number(valor).toFixed(2)) : "") + campo("58", "BR") +
      campo("59", limpa(C.pix.nome).slice(0, 25)) + campo("60", limpa(C.pix.cidade).slice(0, 15)) +
      campo("62", campo("05", "***")) + "6304";
    return p + crc16(p);
  }

  async function copiar(texto, botao) {
    try { await navigator.clipboard.writeText(texto); aviso("Copiado!"); }
    catch {
      const t = document.createElement("textarea");
      t.value = texto; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); aviso("Copiado!"); } catch { aviso("Selecione e copie o texto"); }
      t.remove();
    }
    if (botao) botao.blur();
  }

  let toastTimer;
  function aviso(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2200);
  }

  function caixaPix(container, valor) {
    const codigo = pixCodigo(valor);
    const chave = C.pix.chaveCopiar || C.pix.chave;
    container.innerHTML = `
      <div class="pix">
        <div class="pix-topo">
          <div>
            <span class="sobre">Valor a pagar</span>
            <span class="pix-valor">${brl(valor)}</span>
          </div>
          <div class="pix-qr" aria-label="QR Code do PIX"></div>
        </div>
        <div class="pix-linha">
          <span class="sobre">Chave PIX${C.pix.tipo ? " (" + esc(C.pix.tipo) + ")" : ""}</span>
          <div class="pix-campo"><strong class="chave"></strong>
            <button type="button" class="btn btn-sec btn-p" data-copiar="chave">Copiar chave</button></div>
          <p class="miudo">Cole a chave no app do banco e digite o valor de ${brl(valor)}.</p>
        </div>
        <div class="pix-linha">
          <span class="sobre">PIX copia e cola (já vem com o valor)</span>
          <div class="copia"></div>
          <button type="button" class="btn btn-pri btn-p" data-copiar="codigo">Copiar código PIX</button>
          <p class="miudo">No app do banco, escolha PIX › Copia e cola, ou leia o QR Code.</p>
        </div>
      </div>`;
    container.querySelector(".copia").textContent = codigo;
    container.querySelector(".chave").textContent = C.pix.chaveExibir || chave;
    const qr = container.querySelector(".pix-qr");
    if (window.QRCode) new QRCode(qr, { text: codigo, width: 300, height: 300, correctLevel: QRCode.CorrectLevel.M });
    else qr.hidden = true;
    container.querySelector('[data-copiar="codigo"]').onclick = (e) => copiar(codigo, e.currentTarget);
    container.querySelector('[data-copiar="chave"]').onclick = (e) => copiar(chave, e.currentTarget);
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------------------------------------------------------------- abas
  // Uma página só: cada aba é uma seção, e o menu acompanha a rolagem.
  function marcarAba(aba) {
    document.querySelectorAll(".abas button").forEach((b) => {
      if (b.dataset.ir === aba) {
        if (b.getAttribute("aria-current")) return;
        b.setAttribute("aria-current", "page");
        // no celular o menu rola de lado: traz a aba atual para a vista sem mexer na página
        const nav = b.parentElement;
        nav.scrollLeft = b.offsetLeft - nav.offsetLeft - (nav.clientWidth - b.offsetWidth) / 2;
      }
      else b.removeAttribute("aria-current");
    });
    if (location.hash !== "#" + aba) history.replaceState(null, "", "#" + aba);
  }
  function irPara(aba, suave = true) {
    if (!ABAS.includes(aba) || $("#" + aba).hidden) aba = "evento";
    $("#" + aba).scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" });
    marcarAba(aba);
  }
  function abaVisivel() {
    const linha = $(".topo").offsetHeight + 80;
    const visiveis = ABAS.filter((a) => !$("#" + a).hidden);
    let atual = visiveis[0];
    visiveis.forEach((a) => { if ($("#" + a).getBoundingClientRect().top <= linha) atual = a; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) atual = visiveis[visiveis.length - 1];
    return atual;
  }
  window.addEventListener("scroll", () => marcarAba(abaVisivel()), { passive: true });
  const medirTopo = () => document.documentElement.style.setProperty("--topo-h", $(".topo").offsetHeight + "px");
  window.addEventListener("resize", medirTopo);
  medirTopo();
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-ir]");
    if (alvo) { e.preventDefault(); irPara(alvo.dataset.ir); }
  });
  window.addEventListener("hashchange", () => irPara(location.hash.slice(1)));

  // ---------------------------------------------------------------- evento
  function montarEvento() {
    document.title = C.titulo;
    $("#marca-texto").textContent = C.titulo;
    $("#titulo").textContent = C.titulo;
    $("#anfitrioes").textContent = C.anfitrioes;
    $("#recado").textContent = C.recado;
    $("#data-texto").textContent = C.dataTexto;
    $("#hora-texto").textContent = C.horaTexto;
    $("#confirmar-ate").textContent = C.confirmarAte;
    // data no formato de convite: DOMINGO | 13 dezembro 2026 | A PARTIR DAS 12H
    const quando = new Date(C.data + "T" + C.hora);
    $("#inv-semana").textContent = quando.toLocaleDateString("pt-BR", { weekday: "long" });
    $("#inv-dia").textContent = quando.getDate();
    $("#inv-mes").textContent = quando.toLocaleDateString("pt-BR", { month: "long" });
    $("#inv-ano").textContent = quando.getFullYear();

    const dias = Math.ceil((new Date(C.data + "T" + C.hora) - new Date()) / 86400000);
    $("#contagem").textContent = dias > 1 ? `Faltam ${dias} dias` : dias === 1 ? "É amanhã!" : dias === 0 ? "É hoje!" : "Já aconteceu, obrigado!";

    const e = C.endereco;
    const linha = [e.nome, e.rua, e.bairro, e.cidade, e.cep && "CEP " + e.cep].filter(Boolean).join(", ");
    $("#endereco").innerHTML = "";
    const cidadeCep = [e.cidade, e.cep && "CEP " + e.cep].filter(Boolean).join(" · ");
    [e.nome, e.rua, e.bairro, cidadeCep].filter(Boolean).forEach((t, i) => {
      const s = document.createElement("span"); s.textContent = t;
      if (i === 0 && e.nome) s.className = "local";
      $("#endereco").appendChild(s);
    });
    if (e.referencia) { const s = document.createElement("span"); s.className = "ref"; s.textContent = e.referencia; $("#endereco").appendChild(s); }
    const q = encodeURIComponent(C.mapsBusca || linha);
    const ll = (C.coordenadas || "").replace(/\s/g, "");
    $("#link-maps").href = C.linkMaps || `https://www.google.com/maps/search/?api=1&query=${ll || q}`;
    $("#link-waze").href = ll ? `https://waze.com/ul?ll=${ll}&navigate=yes` : `https://waze.com/ul?q=${q}&navigate=yes`;
    $("#mapa").src = `https://www.google.com/maps?q=${ll || q}&z=16&output=embed`;
    $("#copiar-endereco").onclick = (ev) => copiar(linha, ev.currentTarget);
  }

  // ---------------------------------------------------------------- presentes
  // Só aparece o que ainda dá para escolher: item com todas as unidades reservadas sai da lista.
  let listaPronta = false; // só desenha depois de saber o que já foi reservado
  const restantes = (item) => { const q = item.quantidade || 1; return q - Math.min(contagem(reservas[item.id]), q); };

  function montarCategorias() {
    const cats = ["Todos", ...new Set(C.itens.filter((i) => restantes(i) > 0).map((i) => i.categoria).filter(Boolean))];
    if (!cats.includes(categoria)) categoria = "Todos";
    $("#categorias").innerHTML = "";
    cats.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c;
      b.setAttribute("aria-pressed", c === categoria);
      b.onclick = () => { categoria = c; montarLista(); };
      $("#categorias").appendChild(b);
    });
  }

  function montarLista() {
    if (!listaPronta) return;
    montarCategorias();
    const ul = $("#lista"); ul.innerHTML = "";
    C.itens.forEach((item) => {
      const qtd = item.quantidade || 1;
      const faltam = restantes(item);
      if (faltam <= 0) return;
      if (categoria !== "Todos" && item.categoria !== categoria) return;

      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button"; b.className = "etiqueta";
      const estado = faltam < qtd ? ["parcial", `Faltam ${faltam} de ${qtd}`]
        : ["livre", qtd > 1 ? `Disponível · ${qtd} unid.` : "Disponível"];
      if (item.foto) b.classList.add("com-foto");
      b.innerHTML = `
        ${item.foto ? '<img class="foto-item" loading="lazy" alt="">' : ""}
        <span class="cat"></span>
        <span class="nome"></span>
        <span class="estado ${estado[0]}">${estado[1]}</span>
        <span class="valor${item.valor ? "" : " sem-valor"}">${item.valor ? brl(item.valor) : "Valor a confirmar"}</span>
        ${item.valor ? '<span class="valor-nota">valor médio</span>' : ""}`;
      if (item.foto) b.querySelector("img").src = item.foto;
      b.querySelector(".cat").textContent = item.categoria || "";
      b.querySelector(".nome").textContent = item.nome;
      b.setAttribute("aria-label", `${item.nome}, ${item.valor ? brl(item.valor) : "valor a confirmar"}, ${estado[1]}`);
      b.onclick = () => abrirItem(item);
      li.appendChild(b); ul.appendChild(li);
    });

    if (!ul.children.length) {
      const tudo = C.itens.every((i) => restantes(i) <= 0);
      ul.innerHTML = `<li class="vazio">${tudo ? "Todos os presentes já foram escolhidos. Muito obrigado, família e amigos!" : "Nenhum item disponível neste filtro."}</li>`;
    }
  }
  async function atualizarReservas() {
    try {
      reservas = await buscarReservas();
      $("#carregando").hidden = true;
    } catch {
      $("#carregando").textContent = "Não foi possível conferir o que já foi escolhido agora. Tente recarregar a página.";
    }
    listaPronta = true;
    montarLista();
  }

  // ---------------------------------------------------------------- modal de reserva
  // Dois jeitos de presentear (a aba ativa é a forma gravada na planilha):
  //   pix   = enviar o valor do item por PIX
  //   livre = levar um item de sua preferência
  const modal = $("#modal");
  let formaAtual = "pix";

  function abrirItem(item) {
    itemAtual = item;
    $("#m-passo1").hidden = false;
    $("#m-categoria").textContent = item.categoria || "Presente";
    $("#m-titulo").textContent = item.nome;
    $("#m-valor").textContent = item.valor ? brl(item.valor) : "Valor a confirmar";
    $("#m-valor-nota").hidden = !item.valor;
    const foto = $("#m-foto");
    foto.hidden = !item.foto;
    if (item.foto) { foto.src = item.foto; foto.alt = item.nome; }
    $("#r-erro").hidden = true;
    $("#r-cpf").removeAttribute("aria-invalid");
    escolherForma("pix");
    modal.showModal();
    modal.scrollTop = 0;
  }

  function escolherForma(forma) {
    formaAtual = forma;
    document.querySelectorAll("#m-abas [role=tab]").forEach((b) => {
      const ativa = b.dataset.forma === forma;
      b.setAttribute("aria-selected", ativa);
      b.tabIndex = ativa ? 0 : -1;
    });
    const painel = $("#m-painel");
    painel.innerHTML = "";
    if (forma === "pix") {
      if (itemAtual.valor) caixaPix(painel, itemAtual.valor);
      else painel.innerHTML = `<p class="m-texto">O valor deste item ainda será informado. Volte em breve para enviar por PIX,
        ou escolha outra aba para levar o presente.</p>`;
    } else {
      painel.innerHTML = `<p class="m-texto"></p>
        <p class="miudo">Leve no dia do evento, ${esc(C.dataTexto.toLowerCase())}.</p>`;
      painel.querySelector(".m-texto").textContent =
        `Você também pode levar “${itemAtual.nome}” do modelo, da cor e da marca que preferir. Vamos adorar!`;
    }
    // sem valor definido, não dá para reservar como PIX
    $("#r-enviar").disabled = forma === "pix" && !itemAtual.valor;
    $("#r-enviar").textContent = "Reservar este presente";
  }
  // abas com setas do teclado
  $("#m-abas").addEventListener("click", (e) => {
    const b = e.target.closest("[role=tab]"); if (b) escolherForma(b.dataset.forma);
  });
  $("#m-abas").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const abas = [...document.querySelectorAll("#m-abas [role=tab]")];
    const i = abas.findIndex((b) => b.dataset.forma === formaAtual);
    const prox = abas[(i + (e.key === "ArrowRight" ? 1 : abas.length - 1)) % abas.length];
    escolherForma(prox.dataset.forma); prox.focus();
  });

  $("#m-fechar").onclick = () => modal.close();
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  $("#r-cpf").addEventListener("input", (e) => (e.target.value = mascaraCpf(e.target.value)));

  $("#form-reserva").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, erro = $("#r-erro");
    const nome = f.nome.value.trim(), cpf = f.cpf.value, forma = formaAtual;
    erro.hidden = true;
    if (nome.split(/\s+/).length < 2) { erro.textContent = "Escreva seu nome e sobrenome."; erro.hidden = false; f.nome.focus(); return; }
    if (!cpfValido(cpf)) { erro.textContent = "Esse CPF não parece válido. Confira os números."; erro.hidden = false; f.cpf.setAttribute("aria-invalid", "true"); f.cpf.focus(); return; }
    f.cpf.removeAttribute("aria-invalid");

    const botao = $("#r-enviar"); botao.disabled = true; botao.textContent = "Reservando…";
    try {
      const r = await enviar({
        acao: "reservar", itemId: itemAtual.id, item: itemAtual.nome, valor: itemAtual.valor || 0,
        limite: itemAtual.quantidade || 1, nome, cpf: cpf.replace(/\D/g, ""), forma,
      });
      if (!r.ok) {
        erro.textContent = r.erro === "esgotado"
          ? "Poxa, alguém acabou de reservar este item. Escolha outro da lista."
          : "Não deu para reservar agora. Tente de novo em instantes.";
        erro.hidden = false;
        if (r.erro === "esgotado") atualizarReservas();
        return;
      }
      if (r.reservas) reservas = r.reservas;
      montarLista();
      mostrarConfirmacao(nome, forma);
      f.reset();
    } catch {
      erro.textContent = "Sem conexão com a lista. Verifique a internet e tente de novo.";
      erro.hidden = false;
    } finally {
      botao.disabled = false; botao.textContent = "Reservar este presente";
    }
  });

  // ---------------------------------------------------------------- agradecimento
  // Depois de reservar um presente ou avisar um PIX, aparece SÓ o vídeo do casal e a mensagem,
  // numa janela que ocupa 80% da tela. A mensagem muda conforme o caso.
  const modalObrigado = $("#modal-obrigado");
  function mostrarAgradecimento(mensagem) {
    if (modal.open) modal.close();
    $("#mo-msg").textContent = mensagem || "";
    const video = $("#mo-video");
    video.hidden = !C.videoObrigado;
    modalObrigado.showModal();
    $("#mo-corpo").scrollTop = 0;
    if (C.videoObrigado) {
      if (!video.getAttribute("src")) video.src = C.videoObrigado;
      video.currentTime = 0;
      // o clique em "Reservar"/"Avisar" libera o som; se o navegador não deixar, tenta mudo
      video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
    }
  }
  const mostrarConfirmacao = () => mostrarAgradecimento(C.mensagemObrigado);   // reservou um presente
  const abrirObrigadoPix = () => mostrarAgradecimento(C.mensagemObrigadoPix);  // avisou um PIX
  $("#mo-fechar").onclick = () => modalObrigado.close();
  modalObrigado.addEventListener("click", (e) => { if (e.target === modalObrigado) modalObrigado.close(); });
  modalObrigado.addEventListener("close", () => $("#mo-video").pause());
  // ---------------------------------------------------------------- presença
  document.querySelectorAll('input[name="vai"]').forEach((r) =>
    r.addEventListener("change", () => ($("#p-qtd-bloco").hidden = $("#form-presenca").vai.value === "nao")));

  // Um campo de nome para cada acompanhante (mantém o que já foi digitado)
  function montarAcompanhantes() {
    const caixa = $("#p-acomp");
    const n = Math.max(0, Math.min(10, Math.floor(Number($("#p-qtd").value) || 0)));
    const digitados = [...caixa.querySelectorAll("input")].map((i) => i.value);
    caixa.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const id = "p-acomp-" + (i + 1);
      const l = document.createElement("label");
      l.htmlFor = id; l.textContent = `Nome do acompanhante ${i + 1}`;
      const inp = document.createElement("input");
      inp.id = id; inp.autocomplete = "off"; inp.value = digitados[i] || "";
      caixa.append(l, inp);
    }
  }
  $("#p-qtd").addEventListener("input", montarAcompanhantes);
  $("#p-tel").addEventListener("input", (e) => (e.target.value = mascaraTel(e.target.value)));

  $("#form-presenca").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, erro = $("#p-erro"), botao = f.querySelector("button[type=submit]");
    erro.hidden = true;
    if (f.nome.value.trim().length < 3) { erro.textContent = "Escreva seu nome."; erro.hidden = false; f.nome.focus(); return; }
    const telefone = f.telefone.value.replace(/\D/g, "");
    if (telefone && !telefoneValido(telefone)) {
      erro.textContent = "Digite o celular com DDD no padrão (61) 98305-4422: 11 números, começando pelo DDD e com o 9 depois dele.";
      erro.hidden = false; f.telefone.setAttribute("aria-invalid", "true"); f.telefone.focus(); return;
    }
    f.telefone.removeAttribute("aria-invalid");
    const vai = f.vai.value;
    const campos = vai === "sim" ? [...$("#p-acomp").querySelectorAll("input")] : [];
    const vazio = campos.find((i) => !i.value.trim());
    if (vazio) { erro.textContent = "Escreva o nome de cada acompanhante."; erro.hidden = false; vazio.focus(); return; }
    const acompanhantes = campos.map((i) => i.value.trim());
    botao.disabled = true;
    try {
      const r = await enviar({
        acao: "presenca", nome: f.nome.value.trim(), vai,
        pessoas: vai === "sim" ? 1 + acompanhantes.length : 0,
        acompanhantes, telefone, recado: f.recado.value.trim(),
      });
      if (!r.ok) throw new Error();
      f.hidden = true;
      const ok = $("#presenca-ok");
      ok.innerHTML = vai === "sim"
        ? `<h2>Presença confirmada!</h2><p>Te esperamos ${esc(C.dataTexto.toLowerCase())}, ${esc(C.horaTexto)}.</p>
           <div class="acoes"><button type="button" class="btn btn-pri" data-ir="presentes">Escolher um presente</button>
           <button type="button" class="btn btn-sec" data-ir="local">Ver a localização</button></div>`
        : `<h2>Obrigado por avisar!</h2><p>Vamos sentir sua falta. Se quiser, você ainda pode ajudar com um presente ou um valor.</p>
           <div class="acoes"><button type="button" class="btn btn-sec" data-ir="contribuir">Ajudar com um valor</button></div>`;
      ok.hidden = false;
    } catch {
      erro.textContent = "Não deu para enviar agora. Verifique a internet e tente de novo.";
      erro.hidden = false;
    } finally { botao.disabled = false; }
  });

  // ---------------------------------------------------------------- contribuição
  const MINIMO = Number(C.valorMinimo) || 1;
  let valorEscolhido = C.valoresSimbolicos.find((v) => v >= MINIMO) || MINIMO;
  $("#valor-livre").min = MINIMO;
  $("#valor-minimo").textContent = `Valor mínimo: ${brl(MINIMO)}.`;
  function montarValores() {
    $("#valores").innerHTML = "";
    $("#valor-minimo").classList.remove("erro");
    C.valoresSimbolicos.filter((v) => v >= MINIMO).forEach((v) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = brl(v);
      b.setAttribute("aria-pressed", v === valorEscolhido);
      b.onclick = () => { valorEscolhido = v; $("#valor-livre").value = ""; montarValores(); };
      $("#valores").appendChild(b);
    });
    caixaPix($("#pix-contribuir"), valorEscolhido);
  }
  $("#valor-livre").addEventListener("input", (e) => {
    const v = Math.round(Number(e.target.value.replace(",", ".")) * 100) / 100;
    if (!e.target.value) { montarValores(); return; }
    document.querySelectorAll("#valores .chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    const ok = v >= MINIMO;
    $("#valor-minimo").classList.toggle("erro", !ok);
    $("#valor-minimo").textContent = ok ? `Valor mínimo: ${brl(MINIMO)}.` : `O valor mínimo é ${brl(MINIMO)}.`;
    valorEscolhido = ok ? v : null;
    if (ok) caixaPix($("#pix-contribuir"), v);
    else $("#pix-contribuir").innerHTML = "";
  });

  $("#form-contribuir").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, erro = $("#c-erro"), botao = f.querySelector("button[type=submit]");
    erro.hidden = true;
    if (f.nome.value.trim().length < 2) { erro.textContent = "Escreva seu nome."; erro.hidden = false; f.nome.focus(); return; }
    if (!(valorEscolhido >= MINIMO)) { erro.textContent = `Escolha um valor a partir de ${brl(MINIMO)}.`; erro.hidden = false; $("#valor-livre").focus(); return; }
    botao.disabled = true;
    try {
      const r = await enviar({ acao: "contribuicao", nome: f.nome.value.trim(), valor: valorEscolhido, recado: f.recado.value.trim() });
      if (!r.ok) throw new Error();
      f.hidden = true;
      const ok = $("#contribuir-ok");
      ok.innerHTML = `<h2>Muito obrigado!</h2><p>Recebemos seu aviso de ${brl(valorEscolhido)}. Sua ajuda faz diferença na casa nova.</p>`;
      ok.hidden = false;
      abrirObrigadoPix(f.nome.value.trim(), valorEscolhido);
    } catch {
      erro.textContent = "Não deu para enviar o aviso agora. Tente de novo em instantes.";
      erro.hidden = false;
    } finally { botao.disabled = false; }
  });

  // ---------------------------------------------------------------- início
  $("#aviso-demo").hidden = !DEMO;
  if (C.PAINEL_URL) { $("#link-admin").href = C.PAINEL_URL; $("#link-admin").hidden = false; }
  if (DEMO && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname))
    $("#aviso-demo").textContent = "Site em preparação: as confirmações e reservas ainda não estão sendo salvas. Volte em breve!";
  montarEvento();
  montarValores();
  montarLista();
  atualizarReservas();
  setInterval(() => { if (!modal.open) atualizarReservas(); }, 30000);
  const abaInicial = location.hash.slice(1);
  if (ABAS.includes(abaInicial)) {
    // o navegador tenta restaurar a rolagem antiga; e fontes e imagens mudam a altura
    // da página ao carregar: por isso rola de novo para a seção pedida depois do load
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    irPara(abaInicial, false);
    window.addEventListener("load", () => setTimeout(() => irPara(abaInicial, false), 50), { once: true });
  } else marcarAba(abaVisivel());
})();
