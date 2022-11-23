let url = 'https://rickandmortyapi.com/api/character';
const pesquisa = document.querySelector('.pesquisa');
const btnPesquisar = document.querySelector('.pesquisar');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const containerPersonagens = document.querySelector('.personagens');
let paginaAnterior;
let proximaPagina;

const buscarApi = async (url) => {
  const req = await fetch(url);
  if (req.status === 200) return await req.json();
}

const verificarProximoEAnterior = async (info) => {
  (info.prev === null) ? btnPrev.setAttribute('disabled', '') : btnPrev.removeAttribute('disabled');
  (info.next === null) ? btnNext.setAttribute('disabled', '') : btnNext.removeAttribute('disabled');
  paginaAnterior = info.prev;
  proximaPagina = info.next;
}

const buscarPersonagens = async (url) => {
  const reqJSON = await buscarApi(url);
  if (reqJSON) {
    const { info, results } = reqJSON;
    verificarProximoEAnterior(info);
    containerPersonagens.innerHTML = '';
    results.forEach((personagem) => criarPersonagem(personagem))
  }
  return !!reqJSON;
}

buscarPersonagens(url);

const criarPersonagem = async (personagem) => {
  const { name: nameCharacter, status, species, image, episode: episodeURL } = personagem;
  const { name: nameEp, episode } = await buscarApi(episodeURL[0]);
  const div = document.createElement('div');
  div.classList.add('personagem');
  div.innerHTML = `<div>
                    <img src="${image}" alt="">
                    <span class="status ${status.toLowerCase()}">${status}</span>
                  </div>
                  <div class="sobre">
                    <p class="nome">${nameCharacter}</p>
                    <p class="especie">${species}</p>
                    <p class="titulo-primeiro-episodio">First seen in:</p>
                    <p class="primeiro-episodio">${nameEp} (${episode})</p>
                  </div>`;
  containerPersonagens.appendChild(div);
}

const pesquisarPersonagens = async (event) => {
  event.preventDefault();
  exibirMensagem('Searching...');
  let busca = await buscarPersonagens(`https://rickandmortyapi.com/api/character/?status=${pesquisa.value}`);
  if (!busca) busca = await buscarPersonagens(`https://rickandmortyapi.com/api/character/?name=${pesquisa.value}`);
  if (!busca) busca = await buscarPersonagens(`https://rickandmortyapi.com/api/character/?species=${pesquisa.value}`);
  if (!busca) exibirMensagem('No characters found');
}

const exibirMensagem = (msg) => containerPersonagens.innerHTML = `<p class='msg'>${msg}</p>`;

btnPesquisar.addEventListener('click', pesquisarPersonagens);
btnPrev.addEventListener('click', () => buscarPersonagens(paginaAnterior));
btnNext.addEventListener('click', () => buscarPersonagens(proximaPagina));