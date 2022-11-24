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


const criarPersonagem = async (dadosPersonagem) => {
  const { 
    name: nameCharacter, 
    status,
    species,
    gender,
    origin: {name: origin},
    location: {name: lastLocation},
    image,
    episode: episodeURL
  } = dadosPersonagem;

  const { name: nameEp, episode } = await buscarApi(episodeURL[0]);

  const divPersonagem = document.createElement('div');
  divPersonagem.classList.add('container-flip');
  divPersonagem.innerHTML = `
  <div class="flipper">
    <div class="personagem front">
      <img src="${image}" alt="">
      <span class="status ${(status).toLowerCase()}">${status}</span>
      <div class="sobre">
        <p class="nome">${nameCharacter}</p>
        <div class="box-especie">
          <p class="especie">${species}</p>
        </div>
        <p class="titulo-caracteristica">First seen in:</p>
        <p class="caracteristica">${episode} - ${nameEp}</p>
      </div>
    </div>
    <div class="back">
      <div class="personagem modal">
        <div class="container-nome-status">
          <p class="nome">${nameCharacter}</p>
          <span class="status ${(status).toLowerCase()}">${status}</span>
        </div>
        <div class="box-especie">
          <p class="especie">${species}</p>
        </div>
        <p class="titulo-caracteristica">Gender:</p>
        <p class="caracteristica">${gender}</p>
        <p class="titulo-caracteristica">Origin:</p>
        <p class="caracteristica">${origin}</p>
        <p class="titulo-caracteristica">Last know location:</p>
        <p class="caracteristica">${lastLocation}</p>
        <p class="titulo-caracteristica">Present in episodes:</p>
        <ul class="caracteristica"></ul>
      </div>
    </div>
  </div>`;

  episodeURL.forEach(async (ep) => {
    const { name, episode } = await buscarApi(ep)
    const li = document.createElement('li');
    li.innerText = `${episode} - ${name}`;
    divPersonagem.querySelector('ul').appendChild(li);
  });
  
  divPersonagem.addEventListener('click', () => divPersonagem.classList.toggle('ativo'));
  containerPersonagens.appendChild(divPersonagem);
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