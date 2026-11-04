# Chá de Casa Nova — como colocar no ar

O site tem 4 abas: **O evento** (data, endereço escrito e mapa), **Confirmar presença**,
**Presentes** (lista com reserva por nome + CPF, levando no dia ou mandando o valor por PIX)
e **Ajudar com um valor** (PIX com valor simbólico, sem escolher item).

## 1. Coloque seus dados

Abra `config.js` e troque: nomes, data e hora, endereço, chave PIX (nome e cidade
iguais aos do banco) e a lista de `itens`. Abra `index.html` no navegador para conferir.
Enquanto `API_URL` estiver vazio, o site roda em **modo de teste** (só no seu navegador).

## 2. Crie a planilha que guarda as respostas (grátis, ~5 min)

1. Em <https://sheets.new> crie uma planilha (ex.: "Chá de Casa Nova").
2. Menu **Extensões › Apps Script**. Apague o que estiver lá e cole o conteúdo de `apps-script/Codigo.gs`. Salve.
3. **Implantar › Nova implantação** › tipo **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize com sua conta Google e copie a **URL do app da Web** (termina em `/exec`).
5. Cole essa URL em `API_URL` no `config.js`.

As abas **Reservas**, **Presenças** e **Contribuições** aparecem sozinhas na planilha
na primeira resposta. O CPF só fica na planilha; no site aparece apenas o primeiro nome.
Para liberar um item reservado por engano, apague a linha dele na aba Reservas.

> Se mudar o `Codigo.gs` depois, use **Implantar › Gerenciar implantações › Editar › Nova versão**
> para a mesma URL continuar valendo.

## 3. Publique o site (grátis)

Opção mais fácil: <https://app.netlify.com/drop> — arraste a pasta `cha-casa-nova` inteira.
Você recebe um link para mandar no WhatsApp. Para atualizar, arraste de novo.

Também funciona no GitHub Pages (a pasta não tem nenhuma senha, só a chave PIX, que já é pública).

## Observação sobre o PIX

O site gera o QR Code e o "copia e cola" já com o valor do item. Ele não consegue confirmar
se o dinheiro caiu: confira no app do seu banco.
