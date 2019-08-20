let evolucao = [];
let testes = [];
let popUp = document.getElementById("popUp");
let opcoes = popUp.children[0].children;
let popOUT = document.getElementById("municipios");
let line = document.getElementById("lineChart");
let bar = document.getElementById("barChart");

var isDirty = false;

let cores = {
	cor1: "#dcf757",
	cor2: "#f7f257",
	cor3: "#f7cf57",
	cor4: "#f59738",
	cor5: "#f56138",
	cor6: "#f50f02"
};

/*

cor1 : "#f5f542",
	cor2 : "#f5e942",
	cor3 : "#f5b342",
	cor4 : "#f59942",
	cor5 : "#f56342",
	cor6 : "#ed0505"
*/

//CARREGA O JSON
function preload() {
	let url = "/jsons/bahia_evolucao.json";
	evolucao = loadJSON(url);
	url = "/jsons/bahia_geral.json";
	testes = loadJSON(url);
}

async function toColorBySearch(jsonFiltered) {
	let id;

	//Apenas municipios possuem ID maior ;; jsonCount in jsonFiltered if(jsonFiltered[jsonCount].ID > 99999){

	isDirty = true;

	for (icount in cidades) {

		id = cidades[icount].node.attributes.id.value;

		if (id.includes("mun_")) {

			id = id.replace("mun_", "");
			var idInt = parseInt(id, 10);

			for (var jsonCount = 0; jsonCount < jsonFiltered.length; jsonCount++) {

				if (jsonFiltered[jsonCount].ID > 99999) //Apenas municipios possuem ID maior que tal valor
				{
					if (idInt === jsonFiltered[jsonCount].ID) //Não podemos colorir quem na busca está
					{
						break;
					}
					else if (jsonCount == jsonFiltered.length - 1) //andou todo o vetor e não encontrou ninguém identico ao ID
					{
						cidades[icount].node.attributes.fill.value = "#8C92AC";
					}
				}
			}
		}
	}

}

function clearSearchOnMap() {
	let id;

	if (isDirty) {
		for (let icount in cidades) {
			id = cidades[icount].node.attributes.id.value;
			id = id.replace("mun_", "");
			for (let jcount in testes.MUNICIPIOS) {

				//QUANDO ENCONTRA IDS IGUAIS, ELE COLORE A CIDADE DE ACORDO COM O VALOR NO JSON
				if (id == testes.MUNICIPIOS[jcount].ID) {
					cidades[icount].node.attributes.fill.value = definirCor(testes.MUNICIPIOS[jcount].VALOR);
					break;
				}
			}
		}
		isDirty = false;
	}
}

//FUNÇÃO QUE CARREGA O PRIMEIRO MAPA
function primeiroMapa() {
	let salvador = searchEquivalent(2927408, evolucao.MUNICIPIOS);
	lineChart(salvador.PERIODOS, salvador.VALORES, salvador.NOME_MUNICIPIO);
}

//FUNÇÃO QUE ADICIONA O POPUP EM CADA CIDADE E TB ADICIONA OS GRAFICOS
function addPopUp(cidade, cidadeEvolucao) {

	//FUNÇÃO QUE ABRE O POPUP
	cidade.node.addEventListener("contextmenu", function (ev) {
		ev.preventDefault();
		mouseX = ev.clientX;
		mouseY = ev.clientY;


		//ADICIONA FUNÇÃO DE LINECHART NO CLIQUE
		line.addEventListener("click", function () {
			lineChart(cidadeEvolucao.PERIODOS, cidadeEvolucao.VALORES, cidadeEvolucao.NOME_MUNICIPIO);
		})

		//ADICIONA FUNÇÃO DE BARCHART NO CLIQUE
		bar.addEventListener("click", function () {
			barChart(cidadeEvolucao.PERIODOS, cidadeEvolucao.VALORES);
		})

		//DEFINE A POSICAO ONDE O POPUP FICARÁ
		popUp.style.top = `${mouseY / 3}px`;
		popUp.style.left = `${mouseX / 3}px`;
		popUp.style.visibility = "visible";
		return false;
	}, false);

	//FUNÇÃO QUE REMOVE O POPUP QUANDO CLICA FORA
	popOUT.addEventListener("click", function () {
		popUp.style.visibility = "hidden";
	})

}

function definirCor(valor) {
	let min = testes.MIN_Valor;
	let max = testes.MAX_Valor;
	let faixa = (max - min) / 6;
	let grupos = [6];
	grupos[0] = min;

	for (let i = 1; i < 6; i++) {
		grupos[i] = grupos[i - 1] + faixa;
	}

	if (valor < grupos[1]) {
		return cores.cor1;
	} else if (valor < grupos[2]) {
		return cores.cor2;
	} else if (valor < grupos[3]) {
		return cores.cor3;
	} else if (valor < grupos[4]) {
		return cores.cor4;
	} else if (valor < grupos[5]) {
		return cores.cor5;
	} else {
		return cores.cor6;
	}
}

//RECEBE UM ID E ENCONTRA O MUNICIPIO EQUIVALENTE NO JSON DE EVOLUCAO 
function searchEquivalent(id, vetor) {
	for (let jcount of vetor) {
		if (jcount.ID == id) {
			return jcount;
		}
	}
}

//FUNÇÃO DE COLORAÇÃO DO MAPA
function setup() {
	primeiroMapa();

	let id;
	let cidadeEvolucao;
	//COMPARA O MAPA COM O JSON
	for (let icount in cidades) {
		id = cidades[icount].node.attributes.id.value;
		id = id.replace("mun_", "");
		for (let jcount in testes.MUNICIPIOS) {

			//QUANDO ENCONTRA IDS IGUAIS, ELE COLORE A CIDADE DE ACORDO COM O VALOR NO JSON
			if (id == testes.MUNICIPIOS[jcount].ID) {
				cidades[icount].node.attributes.fill.value = definirCor(testes.MUNICIPIOS[jcount].VALOR);
				cidadeEvolucao = searchEquivalent(id, evolucao.MUNICIPIOS);
				addPopUp(cidades[icount], cidadeEvolucao);
				break;
			}
		}
	}
}