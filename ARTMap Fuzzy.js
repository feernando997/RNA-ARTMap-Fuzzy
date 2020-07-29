//_______________ FUNÇÕES _______________//

function normalizaMatriz(matriz, nmroLinhas, nmroColunas) {

	let total = 0

	if (nmroLinhas == 0 || nmroLinhas == null) {
		for (let i = 0; i < nmroColunas; i++) {
			total += matriz[i]
		}

		for (let i = 0; i < nmroColunas; i++) {
			matriz[i] /= total
		}
	} else {
		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				total += matriz[i][j]
			}
		}

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				matriz[i][j] /= total
			}
		}
	}

	return matriz
}

function somaColunas(linha, matriz, nmroColunas) {

	let soma = 0

	for (let i = 0; i < Array.length; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			soma += matriz[linha][j]
		}
	}

	return soma
}

function realizaAndMatrizes(aux, entrada, peso, nmroLinhas, nmroColunas) {

	let matriz = [ [0,0], [0,0], [0,0] ] //Necessário colocar dimensões 
	let i = 0, j = 0, x = 0

	for (i = 0; i < matriz.length; i++) {

		for (x = 0; x < matriz.length; x++) {
			for (j = 0; j < nmroColunas; j++) {
				
				if (entrada[i][j] < peso[x][j]) {
					matriz[x][j] = entrada[x][j]
				} else {
					matriz[x][j] = peso[x][j]
				}

			}
		}

	}

	return matriz
}

function realizaTesteDeVigilancia(entrada, peso, catVencedora, nmroColunas){

	let matriz = [[], [], []] //Necessário colocar dimensões 

	for(let i=0; i<matriz.length; i++){
		for(let j=0; j<nmroColunas; j++){
			if(entrada[catVencedora][j] < peso[catVencedora][j]){
				matriz[i][j] = entrada[catVencedora][j]
			}else{
				matriz[i][j] = peso[catVencedora][j]
			}
		}
	}

	return matriz
}

//______________________________________//

//Variaveis de controle da rede
var i = 0, j = 0
var pa = 0.95, pb = 1, pab = 0.95
var alfa = 0.1, beta = 1
var fase = 0

//_______________ Preparação ART B _______________//

var wb = [[1, 1], [1, 1], [1, 1]]
var b = [1, 0, 1]
var yb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

//Normalização (caso valores < 0 ou > 1)
let somaEntradaB = 0

for (i = 0; i < 3; i++) {
	somaEntradaB += b[i]
}

let normalizaB = false

for (i = 0; i < 3; i++) {
	if (b[i] < 0 || b[i] > 1) {
		normalizaB = true
	}
}

if (normalizaB) {
	normalizaMatriz(b, 0, 3)
}

//Complemento (1 - b)
var complementoB = [[0, 0], [0, 0], [0, 0]]
let auxB = [0, 0, 0]

for (i = 0; i < 3; i++) {
	auxB[i] = 1 - b[i]
}

for (i = 0; i < 3; i++) {
	complementoB[i][0] = b[i]
	complementoB[i][1] = auxB[i]
}

//_______________ Preparação ART A _______________//

var wa = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]] //Peso 
var a = [[1, 0], [0, 1], [1, 1]] //Entrada 
var wab = [[1, 1, 1], [1, 1, 1], [1, 1, 1]] //Peso Inter Art
var ya = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades 

//Normalização (caso valores < 0 ou > 1)
let somaEntradaA = 0

for (i = 0; i < 3; i++) {
	for (j = 0; j < 2; j++) {
		somaEntradaA += a[i][j]
	}
}

let normalizaA = false

for (i = 0; i < 3; i++) {
	for (j = 0; j < 2; j++) {
		if (a[i][j] < 0 || a[i][j] > 1) {
			normalizaA = true
		}
	}
}

if (normalizaA) {
	normalizaMatriz(a, 3, 2)
}

//Complemento (1 - a)
let auxA = [[0, 0], [0, 0], [0, 0]]
var complementoA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

for (i = 0; i < 3; i++) {
	for (j = 0; j < 2; j++) {
		auxA[i][j] = 1 - a[i][j]
	}
}

for (i = 0; i < 3; i++) {
	for (j = 0; j < 2; j++) {
		complementoA[i][j] = a[i][j]
	}
}

for (i = 0; i < 3; i++) {
	for (j = 2; j < 4; j++) {
		complementoA[i][j] = auxA[i][j - 2]
	}
}

//_______________ ART B _______________//
console.log("_______________ ART B _______________")

let matB = [[0, 0], [0, 0], [0, 0]] //Matriz de And Logico 
let somaCB = [0, 0, 0] //Vetor de soma das colunas And
let somaPesoB = [0, 0, 0] //Vetor de soma dos Pesos
let Tb = [0, 0, 0] //Vetor de categorias
let x = 0, y = 0, k = 0
var posiK = [0, 0, 0] //Vetor de categoria vencedora auxiliar

for (i = 0; i < 3; i++) {

	//Categorias
	for (x = 0; x < 3; x++) {
		for (j = 0; j < 2; j++) {
			if (complementoB[i][j] < wb[x][j]) {
				matB[x][j] = complementoB[i][j]
			} else {
				matB[x][j] = wb[x][j]
			}
		}
	}

	//Soma colunas AND
	for (x = 0; x < 3; x++) {
		somaCB[x] = somaColunas(x, matB, 2)
	}

	//Soma colunas Peso
	for (x = 0; x < 3; x++) {
		somaPesoB[x] = somaColunas(x, wb, 2)
	}

	console.log("Soma coluna AND: ")
	console.log(somaCB)
	console.log("Soma coluna peso WB: ")
	console.log(somaPesoB)

	//Cria as categorias
	for (x = 0; x < 3; x++) {
		Tb[x] = somaCB[x] / (alfa + somaPesoB[x])
	}

	console.log("Categorias criadas: ")
	console.log(Tb)

	//Encontra categoria vencedora
	let maiorB = Math.max(...Tb)
	var K = Tb.indexOf(maiorB)
	console.log("Categoria Vencedora " + i + ": " + K)

	//Envia valor de K para o Art A
	posiK[i] = K

	//Teste de vigilancia
	let vigilanciaB = [[0, 0], [0, 0], [0, 0]]

	for (j = 0; j < 2; j++) {
		if (complementoB[K][j] < wb[K][j]) {
			vigilanciaB[i][j] = complementoB[K][j]
		} else {
			vigilanciaB[i][j] = wb[K][j]
		}
	}

	let somaVigB = [0, 0, 0]
	let somaB = [0, 0, 0]

	somaVigB[i] = somaColunas(i, vigilanciaB, 2)
	somaB[i] = somaColunas(i, complementoB, 2)

	let tVigilanciaB = [0, 0, 0]

	tVigilanciaB[i] = somaVigB[i] / somaB[i]
	console.log("Teste de vigilancia " + i + ": " + tVigilanciaB)

	//Valida vigilancia
	while (tVigilanciaB[i] < pb) {

		//Recria categorias
		Tb[K] = 0
		maiorB = Math.max(...Tb)
		K = Tb.indexOf(maiorB)
		console.log("Nova categoria vencedora " + i + ": " + K)

		//Teste de vigilancia
		for (j = 0; j < 2; j++) {
			if (complementoB[K][j] < wb[K][j]) {
				vigilanciaB[i][j] = complementoB[K][j]
			} else {
				vigilanciaB[i][j] = wb[K][j]
			}
		}
		somaVigB = [0, 0, 0]
		somaB = [0, 0, 0]

		somaVigB[i] = somaColunas(i, vigilanciaB, 2)
		somaB[i] = somaColunas(i, complementoB, 2)

		tVigilanciaB = [0, 0, 0]

		tVigilanciaB[i] = somaVig[i] / somaB[i]
		console.log("Novo teste de vigilancia " + i + ": " + tVigilanciaB)

	}//Fim While

	//Atualiza o peso Wb
	for (j = 0; j < 2; j++) {
		wb[K][j] = beta * vigilanciaB[i][j] + (1 - beta) * wb[K][j]
	}

	//Matriz de Atividades B
	yb[i][K] = 1

	Tb = []
	somaCB = []
	somaPesoB = []

}//Fim for art B

/*console.log("Entrada B: ")
console.log(complementoB)
console.log("Matriz do AND B:")
console.log(matB)
console.log("WB Atualizado: ")
console.log(wb)
console.log("Matriz de Atividades B:")
console.log(yb)*/

console.log('\n')
console.log('\n')

//_______________ ART A _______________//
console.log("_______________ ART A _______________")

let matA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]] 
let somaCA = [0, 0, 0]
let somaPesoA = [0, 0, 0]
let Ta = [0, 0, 0]

for (i = 0; i < 3; i++) {

	//Categorias
	for (x = 0; x < 3; x++) {
		for (j = 0; j < 4; j++) {
			if (complementoA[i][j] < wa[x][j]) {
				matA[x][j] = complementoA[i][j]
			} else {
				matA[x][j] = wa[x][j]
			}
		}
	}

	//Soma colunas peso
	for (x = 0; x < 3; x++) {
		somaCA[x] = somaColunas(x, matA, 4)
	}

	//Soma colunas peso
	for (x = 0; x < 3; x++) {
		somaPesoA[x] = somaColunas(x, wa, 4)
	}

	console.log("Soma coluna AND A: ")
	console.log(somaCA)
	console.log("Soma coluna peso WA: ")
	console.log(somaPesoA)

	//Cria as categorias
	for (x = 0; x < 3; x++) {
		Ta[x] = somaCA[x] / (alfa + somaPesoA[x])
	}

	console.log("Categorias criadas A: ")
	console.log(Ta)

	//Encontra categoria vencedora
	let maiorA = Math.max(...Ta)
	let J = Ta.indexOf(maiorA)
	console.log("Categoria vencedora A " + i + ": " + J)

	//Teste de vigilancia
	let vigilanciaA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0]]

	for (j = 0; j < 4; j++) {
		if (complementoA[J][j] < wa[J][j]) {
			vigilanciaA[i][j] = complementoA[J][j]
		} else {
			vigilanciaA[i][j] = wa[J][j]
		}
	}

	let somaVigA = [0, 0, 0]
	let somaA = [0, 0, 0]

	somaVigA[i] = somaColunas(i, vigilanciaA, 4)
	somaA[i] = somaColunas(i, complementoA, 4)

	let tVigilanciaA = [0, 0, 0]

	tVigilanciaA[i] = somaVigA[i] / somaA[i]
	console.log("Teste de vigilancia A " + i + ": " + tVigilanciaA)

	//Match tracking
	var mt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

	for (x = 0; x < 3; x++) {
		for (j = 0; j < 3; j++) {
			if (yb[x][j] < wab[J][j]) {
				mt[x][j] = yb[x][j]
			} else {
				mt[x][j] = wab[J][j]
			}
		}
	}

	let somaMt = [0, 0, 0]
	let somaYb = [0, 0, 0]

	for (x = 0; x < 3; x++) {
		somaMt[x] = somaColunas(x, mt, 3)
		somaYb[x] = somaColunas(x, yb, 3)
	}

	let validaMatch = [0, 0, 0]

	validaMatch[i] = somaMt[i] / somaYb[i]
	console.log("Match tracking " + i + ": " + validaMatch)

	//Valida o Match Tracking
	while (validaMatch[i] < pab) {

		//Categorias
		Ta[J] = 0
		maiorA = Math.max(...Ta)
		J = Ta.indexOf(maiorA)
		console.log("Nova categoria vencedora A " + i + ": " + J)

		//Teste de vigilancia
		vigilanciaA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0]]

		for (j = 0; j < 4; j++) {
			if (complementoA[J][j] < wa[J][j]) {
				vigilanciaA[i][j] = complementoA[J][j]
			} else {
				vigilanciaA[i][j] = wa[J][j]
			}
		}

		somaVigA = [0, 0, 0]
		somaA = [0, 0, 0]

		somaVigA[i] = somaColunas(i, vigilanciaA, 4)
		somaA[i] = somaColunas(i, complementoA, 4)

		tVigilanciaA = [0, 0, 0]

		tVigilanciaA[i] = somaVigA[i] / somaA[i]
		console.log("Novo teste de vigilancia A " + i + ": " + tVigilanciaA)

		//Valida Vigilancia
		while (tVigilanciaA[i] < pa) {

			//Recria categorias
			Ta[J] = 0
			maiorA = Math.max(...Ta)
			J = Ta.indexOf(maiorA)
			console.log("Nova categoria vencedora " + i + ": " + J)

			//Teste Vigilancia
			for (j = 0; j < 4; j++) {
				if (complementoA[J][j] < wa[J][j]) {
					vigilanciaA[i][j] = complementoA[J][j]
				} else {
					vigilanciaA[i][j] = wa[J][j]
				}
			}

			somaVigA = [0, 0, 0]
			somaA = [0, 0, 0]

			somaVigA[i] = somaColunas(i, vigilanciaA, 4)
			somaA[i] = somaColunas(i, complementoA, 4)

			tVigilanciaA = [0, 0, 0]

			tVigilanciaA[i] = somaVigA[i] / somaA[i]
			console.log("Valida teste de vigilancia A" + i + ": " + tVigilanciaA)

		}//Fim While Vigilancia

		//Refaz o match tracking
		mt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

		for (x = 0; x < 3; x++) {
			for (j = 0; j < 3; j++) {
				if (yb[x][j] < wab[J][j]) {
					mt[x][j] = yb[x][j]
				} else {
					mt[x][j] = wab[J][j]
				}
			}
		}

		somaMt = [0, 0, 0]
		somaYb = [0, 0, 0]

		for (x = 0; x < 3; x++) {
			somaMt[x] = somaColunas(x, mt, 3)
			somaYb[x] = somaColunas(x, yb, 3)
		}

		validaMatch = [0, 0, 0]

		validaMatch[i] = somaMt[i] / somaYb[i]
		console.log("Valida match tracking " + i + ": " + validaMatch)

	}//Fim do while Match

	//Atualiza o peso Wa
	for (j = 0; j < 4; j++) {
		wa[J][j] = beta * vigilanciaA[i][j] + (1 - beta) * wa[J][j]
	}

	Ta = []
	somaCA = []
	somaPesoA = []
	somaMt = []
	somaYb = []

	//Matriz de atividades A
	ya[i][J] = 1

	//Atualiza Peso Inter Art
	for (j = 0; j < 3; j++) {
		wab[J][j] = 0
	}

	K = posiK[i] //Obtém valores de K de art B
	wab[J][K] = 1

}//Fim for art A

/*console.log("Entrada A: ")
console.log(complementoA)
console.log("Matriz do AND A:")
console.log(matA)
console.log("Match Tracking:")
console.log(mt)
console.log("WA Atualizado: ")
console.log(wa)
console.log("WAB Atualizado: ")
console.log(wab)
console.log("Matriz de Atividades A:")
console.log(ya)*/

console.log('\n')
console.log('\n')

//_______________ DIAGNOSTICO _______________//
console.log("_______________ DIAGNOSTICO _______________")

fase = 1 //Ativa diagnostico

var pd = 0.5
var d = [[1, 1], [0.5, 1], [0.2, 0.9]]
var yd = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
var ybd = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades Inter Art
let matD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
var wbd = [[0, 0], [0, 0], [0, 0]] //Matriz de conhecimento da rede
let somaCD = [0, 0, 0]
let somaPesoD = [0, 0, 0]
let Td = [0, 0, 0]
var fim = [0, 0, 0]

if (fase === 1) {

	//Normalização (caso valores < 0 ou > 1)
	let somaEntradaD = 0

	for (i = 0; i < 3; i++) {
		for (j = 0; j < 2; j++) {
			somaEntradaD += d[i][j]
		}
	}

	let normalizaD = false

	for (i = 0; i < 3; i++) {
		for (j = 0; j < 2; j++) {
			if (d[i][j] < 0 || d[i][j] > 1) {
				normalizaD = true
			}
		}
	}

	if (normalizaD) {
		normalizaMatriz(d, 3, 2)
	}

	//Complemento (1 - d)
	let auxD = [[0, 0], [0, 0], [0, 0]]
	let complementoD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

	for (i = 0; i < 3; i++) {
		for (j = 0; j < 2; j++) {
			auxD[i][j] = 1 - d[i][j]
		}
	}

	for (i = 0; i < 3; i++) {
		for (j = 0; j < 2; j++) {
			complementoD[i][j] = d[i][j]
		}
	}

	for (i = 0; i < 3; i++) {
		for (j = 2; j < 4; j++) {
			complementoD[i][j] = auxD[i][j - 2]
		}
	}

	for (i = 0; i < 3; i++) {

		//Categorias
		for (x = 0; x < 3; x++) {
			for (j = 0; j < 4; j++) {
				if (complementoD[i][j] < wa[x][j]) {
					matD[x][j] = complementoD[i][j]
				} else {
					matD[x][j] = wa[x][j]
				}
			}
		}

		//Soma colunas do AND
		for (x = 0; x < 3; x++) {
			somaCD[x] = somaColunas(x, matD, 4)
		}

		//Soma colunas Peso
		for (x = 0; x < 3; x++) {
			somaPesoD[x] = somaColunas(x, wa, 4)
		}

		console.log("Soma coluna AND D: ")
		console.log(somaCD)
		console.log("Soma coluna peso WA: ")
		console.log(somaPesoD)

		//Cria as categorias
		for (x = 0; x < 3; x++) {
			Td[x] = somaCD[x] / (alfa + somaPesoD[x])
		}

		console.log("Categorias criadas D: ")
		console.log(Td)

		//Encontra categoria vencedora
		let maiorD = Math.max(...Td)
		let D = Td.indexOf(maiorD)
		console.log("Categoria vencedora D " + i + ": " + D)

		//Teste de vigilancia
		let vigilanciaD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

		for (j = 0; j < 4; j++) {
			if (complementoD[D][j] < wa[D][j]) {
				vigilanciaD[i][j] = complementoD[D][j]
			} else {
				vigilanciaD[i][j] = wa[D][j]
			}
		}

		let somaVigD = [0, 0, 0]
		let somaD = [0, 0, 0]

		somaVigD[i] = somaColunas(i, vigilanciaD, 4)
		somaD[i] = somaColunas(i, complementoD, 4)

		let tVigilanciaD = [0, 0, 0]

		tVigilanciaD[i] = somaVigD[i] / somaD[i]
		console.log("Teste de vigilancia D " + i + ": " + tVigilanciaD)

		//Valida Vigilancia
		while (tVigilanciaD[i] < pd) {

			//Recria categorias
			Td[D] = 0
			maiorD = Math.max(...Td)
			D = Td.indexOf(maiorD)
			console.log("Nova categoria vencedora " + i + ": " + D)

			//Teste Vigilancia
			for (j = 0; j < 4; j++) {
				if (complementoD[D][j] < wa[D][j]) {
					vigilanciaD[i][j] = complementoD[D][j]
				} else {
					vigilanciaD[i][j] = wa[D][j]
				}
			}

			somaVigD = [0, 0, 0]
			somaD = [0, 0, 0]

			somaVigD[i] = somaColunas(i, vigilanciaD, 4)
			somaD[i] = somaColunas(i, complementoD, 4)

			tVigilanciaD = [0, 0, 0]

			tVigilanciaD[i] = somaVigD[i] / somaD[i]
			console.log("Valida teste de vigilancia D" + i + ": " + tVigilanciaD)

		}//Fim While Vigilancia

		Td = []
		somaCD = []
		somaPesoD = []

		//Matriz de atividades (Ressonância) D
		yd[i][D] = 1

		//Matriz de Atividades inter art
		for (j = 0; j < 3; j++) {
			ybd[i][j] = yd[i][j] * wab[i][j]
		}

		for (j = 0; j < 3; j++) {
			if (ybd[i][j] === 1) {
				fim[i] = j
				continue
			}
		}

	}//Fim do for fase

	//Cria matriz de diagnostico
	for (x = 0; x < 3; x++) {
		for (j = 0; j < 2; j++) {
			wbd[x][j] = wb[fim[x]][j]
		}
	}

}//Fim do if fase

/*console.log("Entrada D:")
console.log(d)
console.log("AND MAT D:")
console.log(matD)
console.log("Matriz de atividades D:")
console.log(yd)
console.log("Matriz de atividades Inter Art D:")
console.log(ybd)
console.log("Matriz de diagnostico D:")
console.log(wbd)*/
