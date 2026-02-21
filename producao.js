/* =========================
const csvLocal = `
tipo,codigo,descricao,autor,local,pais,link
Livros e capítulos | Libros y capítulos | Books and chapters,livro,La concepción de ambiente en las tesis de maestrías en ciencias sociales La concepción de ambiente en las tesis de maestrías en ciencias socialesLa concepción de ambiente en las tesis de maestrías en ciencias socialesLa concepción de ambiente en las tesis de maestrías en ciencias socialesLa concepción de ambiente en las tesis de maestrías en ciencias socialesLa concepción de ambiente en las tesis de maestrías en ciencias sociales,Katherine Higuita Alzate,Institutional Repository of the Pontifical Bolivarian University,Colombia,https://repository.upb.edu.co/handle/20.500.11912/9777
Artículos científicos | Artigos científicos | Scientific articles,artigo,Educación ambiental y conflictos socioambientales en territorios petroleros,María Fernanda López La concepción de ambiente en las tesis de maestrías en ciencias sociales María Fernanda López La concepción de ambiente en las tesis de maestrías en ciencias sociales,Repositorio Institucional UNAM,México,https://repositorio.unam.mx/
Tesis de doctorado | Teses de doutorado | Doctoral theses,td,Formación docente y justicia ambiental en América Latina,Carlos Eduardo Ramírez,Repositorio Digital USP,Brasil,https://teses.usp.br/
Disertaciones de maestría | Dissertações de mestrado | Master dissertations,td,Educación ambiental crítica en contextos escolares rurales,Juan Pablo Gómez,Repositorio Universidad de Antioquia,Colombia,https://repositorio.udea.edu.co/
Capítulos de libro | Capítulos de livro | Book chapters,livro|co,Educación ambiental y participación comunitaria en zonas afectadas por el petróleo,Ana Lucía Torres,Repositorio Universidad del Valle,Colombia,https://bibliotecadigital.univalle.edu.co/
Artículos en revistas | Artigos em revistas | Journal articles,artigo,Políticas educativas y sostenibilidad en contextos extractivos,Pedro Henrique Silva,Repositorio FGV,Brasil,https://bibliotecadigital.fgv.br/
`;


   ========================= */
   BANCO DE DADOS (CSV LOCAL)

   fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3tihC9fA9hwIDLwI9stuL1-UQOZVubJ6G0_bOMDej3TUySXK-yO9unf3sbW40ph9HEv6-1DH2XN-/pub?gid=199551209&single=true&output=csv")
  .then(res => res.text())
  .then(csv => {
    dados = processarCSV(csv);
    renderizar(dados);
  });

/* =========================
   VARIÁVEIS GLOBAIS
   ========================= */

let dados = [];

/* =========================
   MAPEAMENTOS
   ========================= */

const mapaPaises = {
  ar: "Argentina",
  br: "Brasil",
  ch: "Chile",
  co: "Colombia",
  cu: "Cuba",
  me: "México"
};

const tiposProducao = ["td", "livro", "artigo", "evento", "relatorio"];

/* =========================
   PROCESSAR CSV
   ========================= */

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

/* =========================
   RENDERIZAÇÃO
   ========================= */

function renderizar(lista) {
  const ul = document.getElementById("listaItens");
  const contador = document.getElementById("contador");

  ul.innerHTML = "";

  lista.forEach(item => {
    const li = document.createElement("li");

    const tipoFormatado = item.codigo.join(", ");

    li.innerHTML = `
      <span class="item-geral item-nome">${item.tipo}<span>
      </br></br>


      <span class="item-grupo"> 
          <span class="item-geral">
              <strong>Pais | País| Country: </strong>
                  <span class="item-pais"> ${item.pais}<span>
              </span>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
          <span class="item-geral">
              <strong>Autor | Author: </strong>
                  <span class="item-autor">${item.autor}<span>
              </span>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
          <span class="item-geral">
              <strong>Local | Place: </strong>
                  <span class="item-autor">${item.local}<span>
              </span>
          </span>     
        
          &nbsp;&nbsp;&nbsp;&nbsp;        
      </span>
      </br></br>

      
      <span class="item-geral">
          <strong>Descripción | Descrição | Description: </strong>
              <span class="item-descricao">${item.descricao}</span>
          </span> 
      </br></br>
      

      <span class="item-geral item-link"><a class="item-link" href="${item.link}" target="_blank">🔗<strong>Link</strong></a><span>
    `;

    ul.appendChild(li);
  });

  contador.textContent = `📂 ${lista.length}`;
}

/* =========================
   FILTRAR (BUSCA + CHECKBOX)
   ========================= */

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

    if (tiposProducao.includes(cb.value)) {
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
        item.nome,
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
  dados = processarCSV(csvLocal);
  renderizar(dados);

  // busca dinâmica enquanto digita
  document.getElementById("busca").addEventListener("input", filtrarLista);
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
