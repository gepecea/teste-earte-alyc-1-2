/* =========================
   BANCO DE DADOS (CSV LOCAL)

   obs: 
    tipo1: tese e dissertação
    tipo2: livro e capitulo de livro
    tipo3: artigo em revista
    tipo4: artigo em anais de evento
    tipo5: Relatório

proximos passos: criar nova planilha oficial e trocr os 2  URLS




   ========================= */
let dados = [];

fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3tihC9fA9hwIDLwI9stuL1-UQOZVubJ6G0_bOMDej3TUySXK-yO9unf3sbW40ph9HEv6-1DH2XN-/pub?gid=199551209&single=true&output=csv")
 .then(res => res.text())
 .then(csv => {
   dados = processarCSV(csv);
   renderizar(dados);
 });

/*-----------MAPEAMENTOS----------*/

const mapaPaises = {
  ar: "Argentina",
  br: "Brasil",
  ch: "Chile",
  co: "Colombia",
  cu: "Cuba",
  me: "México"
};

const codigo = ["td", "livro", "artigo", "evento", "relatorio",];

const mapaTipos = {
  tipo1: "Tesis de doctorado y maestría | Teses de doutorado e mestrado | Doctoral and Master's theses",
  tipo2: "Libros y capítulos | Livros e capítulos | Book and chapter",  
  tipo3: "Artículo científico | Artigo científico | Scientific papers",
  tipo4: "Artículos en eventos | Artigos em eventos | Papers in events",
  tipo5: "Informes | Relatório | Report"
};
/*-----------PROCESSAR CSV---------*/

function processarCSV(csv) {
  const linhas = csv.trim().split("\n").slice(1);

  return linhas.map(linha => {
    const colunas = linha.split(",");

    return {
      tipo: colunas[0]?.trim(),
      codigo: colunas[1]?.split("|").map(o => o.trim()) || [],
      descricao: colunas[2]?.trim(),
      autor: colunas[3]?.trim(),
      local: colunas[4]?.trim(),
      pais: colunas[5]?.trim(),
      link: colunas[6]?.trim()
    };
  });
}

/*---------RENDERIZAÇÃO---------*/

function renderizar(lista) {
  const ul = document.getElementById("listaItens");
  const contador = document.getElementById("contador");

  ul.innerHTML = "";

  lista.forEach(item => {
    const li = document.createElement("li");

    const tipoFormatado = mapaTipos[item.tipo] || item.tipo;

li.innerHTML = `
  <span class="item-geral item-nome">${tipoFormatado}</span>
  </br></br>

  <span class="item-grupo"> 
      ${item.pais ? `
      <span class="item-geral">
          <strong>Pais | País| Country: </strong>
          <span class="item-pais">${item.pais}</span>
      </span>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
      ` : ""}

      ${item.autor ? `
      <span class="item-geral">
          <strong>Autor | Author: </strong>
          <span class="item-autor">${item.autor}</span>
      </span>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
      ` : ""}

      ${item.local ? `
      <span class="item-geral">
          <strong>Local | Place: </strong>
          <span class="item-autor">${item.local}</span>
      </span>
      ` : ""}
  </span>

  </br></br>

  ${item.descricao ? `
  <span class="item-geral">
      <strong>Descripción | Descrição | Description: </strong>
      <span class="item-descricao">${item.descricao}</span>
  </span>
  </br></br>
  ` : ""}

  ${item.link ? `
  <span class="item-geral item-link">
      <a class="item-link" href="${item.link}" target="_blank">🔗<strong>Link</strong></a>
  </span>
  ` : ""}
`;

    ul.appendChild(li);
  });

  contador.textContent = `📂 ${lista.length}`;
}

/*----------------FILTRAR (BUSCA + CHECKBOX)-------------*/

function filtrarLista() {
  const termoBusca = document
    .getElementById("busca")
    .value
    .toLowerCase()
    .trim();

  const checkboxes = document.querySelectorAll(".input-filtro:checked");

  const filtrosTipo = new Set();
  const filtrosPais = new Set();
  let mostrarTudo = false;

  checkboxes.forEach(cb => {
    if (cb.value === "tudo") {
      mostrarTudo = true;
      return;
    }

    if (codigo.includes(cb.value)) {
      filtrosTipo.add(cb.value);
    } else if (mapaPaises[cb.value]) {
      filtrosPais.add(mapaPaises[cb.value]);
    }
  });

  const resultado = dados.filter(item => {
    if (mostrarTudo) return true;

    const tipoOK =
      filtrosTipo.size === 0 ||
      item.codigo.some(op => filtrosTipo.has(op));

    const paisOK =
      filtrosPais.size === 0 ||
      filtrosPais.has(item.pais);

    const buscaOK =
      termoBusca === "" ||
      [
        item.tipo,
        item.descricao,
        item.autor,
        item.local,
        item.pais
      ].some(campo =>
        campo?.toLowerCase().includes(termoBusca)
      );

    return tipoOK && paisOK && buscaOK;
  });

  renderizar(resultado);
}

/* =========================
   LIMPAR FILTROS
   ========================= */

function clean() {
  document
    .querySelectorAll(".input-filtro")
    .forEach(cb => (cb.checked = false));

  document.getElementById("busca").value = "";

  renderizar(dados);
}

/* =========================
   INICIALIZAÇÃO
   ========================= */

   document.addEventListener("DOMContentLoaded", () => {

  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3tihC9fA9hwIDLwI9stuL1-UQOZVubJ6G0_bOMDej3TUySXK-yO9unf3sbW40ph9HEv6-1DH2XN-/pub?gid=199551209&single=true&output=csv")
    .then(res => res.text())
    .then(csv => {
      dados = processarCSV(csv);
      renderizar(dados);
    });

  document.getElementById("busca")
    .addEventListener("input", filtrarLista);
});


function ocultarfiltro() {
    const filtro = document.getElementById('filtro');

    if (filtro.style.display === 'none') {
      filtro.style.display = 'flex';
    } else {
      filtro.style.display = 'none';
    }
  }

// Função para esconder caixa de busca produção

window.addEventListener("scroll", function() {
  var elements = document.querySelectorAll(".ocultarbusca");

  for (var i = 0; i < elements.length; i++) {
    if (window.pageYOffset < 920) {
      elements[i].style.display = "flex";
    }
    else {
      elements[i].style.display = "none";
    }
  }
});


