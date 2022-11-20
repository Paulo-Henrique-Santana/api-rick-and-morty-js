let url = 'https://rickandmortyapi.com/api/character';
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const containerPersonagens = document.querySelector('.personagens');
const page = 0;

const buscarRespostaApi = async (url) => {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON;
}

const verificarProximoEAnterior = async () => {
  const { info } = await buscarRespostaApi(url);
  (info.prev === null) ? btnPrev.setAttribute('disabled', '') : btnPrev.removeAttribute('disabled');
  (info.next === null) ? btnNext.setAttribute('disabled', '') : btnNext.removeAttribute('disabled');
}

const buscarPersonagens = async () => {
  const { results } = await buscarRespostaApi(url);
  verificarProximoEAnterior();
  containerPersonagens.innerHTML = '';
  results.forEach((personagem) => criarPersonagem(personagem))
}

buscarPersonagens();

const criarPersonagem = (personagem) => {
  const { name, status, species, location, image } = personagem;
  const div = document.createElement('div');
  div.classList.add('personagem');
  div.innerHTML = `<div>
                    <img src="${image}" alt="">
                    <span class="status ${status.toLowerCase()}">${status}</span>
                  </div>
                  <div class="sobre">
                    <p class="nome">${name}</p>
                    <p class="especie">${species}</p>
                    <p class="titulo-ultima-localizacao">Last know location:</p>
                    <p class="ultima-localizacao">${location.name}</p>
                  </div>`;
  containerPersonagens.appendChild(div)
}

const chamarProximaAnterior = async () => {
  const { info } = await buscarRespostaApi(url);
  url = info.prev;
  buscarPersonagens();
}

const chamarProximaPagina = async () => {
  const { info } = await buscarRespostaApi(url);
  url = info.next;
  buscarPersonagens();
}

btnPrev.addEventListener('click', chamarProximaAnterior)
btnNext.addEventListener('click', chamarProximaPagina)