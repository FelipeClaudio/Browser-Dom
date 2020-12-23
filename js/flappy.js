const elementoPrincipal = CriarElementoPrincial()
const passaro = CriarPassaro()
let fimDoJogo = false;

elementoPrincipal.appendChild(passaro)

const contador = CriarContadorDePontos()
elementoPrincipal.appendChild(contador)

let contadorObstaculos = 0

const intervalo = setInterval(() => {
    if (fimDoJogo){
        FinalizarJogo()
        clearInterval(intervalo)
    }
    else
    {
        CriarObstaculos()
        MoverObstaculos()
    }
}, 2000);

/*-------------------- Métodos criacionais -------------------------------*/

function CriarElementoPrincial(){
    const elementoPrincipal = document.querySelector('[wm-flappy]')
   
    let intervalo = 0

    elementoPrincipal.onmouseup = function (event) {
        intervalo = MoverPassaro(-1, 15, false)
    }

    elementoPrincipal.onmousedown = function (event) {
        clearInterval(intervalo)
        MoverPassaro(2, 5)
    }

    return elementoPrincipal
}

function CriarPassaro(){
    const passaro = document.createElement('img')
    passaro.src = "./imgs/passaro.png"
    passaro.classList.add('passaro')
    passaro.style.top = '90vh'

    return passaro
}

function CriarObstaculos(){
    const obstaculoBaixo = document.createElement('img')
    obstaculoBaixo.src = "./imgs/pipe-green.png"
    obstaculoBaixo.classList.add('obstaculo')
    obstaculoBaixo.style.right = '0vw'
    obstaculoBaixo.id = contadorObstaculos
    const height = (Math.floor(Math.random() * 400)) + 100
    obstaculoBaixo.height = height

    const obstaculoAlto = document.createElement('img')
    obstaculoAlto.src = "./imgs/pipe-green.png"
    obstaculoAlto.classList.add('obstaculo')
    obstaculoAlto.style.top = '10vh'
    obstaculoAlto.style.right = '0vw'
    obstaculoAlto.height = 700 - height
    obstaculoAlto.id = contadorObstaculos + 1
    obstaculoAlto.style.transform = 'rotateX(180deg)'

    contadorObstaculos++

    elementoPrincipal.appendChild(obstaculoBaixo)
    elementoPrincipal.appendChild(obstaculoAlto)    
}

function CriarContadorDePontos() {
    const contador = document.createElement("p")
    contador.classList.add('contador')
    contador.innerHTML = "0 pontos"

    return contador
}

/*-------------------- Métodos comportamentais -------------------------------*/

function VerificarFimDoJogo(){
    const obstaculos = ObterObstaculos()
    const obstaculoBaixo = obstaculos[0]

    if (passaro.x + passaro.width > obstaculoBaixo?.x
        && passaro.x < obstaculoBaixo?.x + obstaculoBaixo?.width
        && passaro.y > obstaculoBaixo?.y){
            FinalizarJogo()
            fimDoJogo = true
    }

    const obstaculoAlto = obstaculos[1]

    if (passaro.x + passaro.width > obstaculoAlto?.x
        && passaro.x < obstaculoAlto?.x + obstaculoAlto.width
        && passaro.y < obstaculoAlto?.height){
            FinalizarJogo()
            fimDoJogo = true
    }
}

function FinalizarJogo(){
    const pFim = document.querySelector('.fim')
    if (!pFim){
        elementoPrincipal.style.backgroundColor = 'black';
        const fim = document.createElement('p')
        fim.innerHTML = "Fim de jogo"
        fim.classList.add('fim')
        fim.style.color = 'white'
        elementoPrincipal.appendChild(fim)
    }
}

function MoverPassaro(deslocamento, tempo, clearHabilitado = true){
    let interationCounter = 0;
    const intervalo = setInterval(() => {
            if(interationCounter > 9 && clearHabilitado){
                clearInterval(intervalo)
            }

            // remove o "vh" para realizar a conta
            const tempTop = passaro.style.top.replace('vh','') - deslocamento
            let top = 0;

            // Não deixa o pássaro passar do chão
            if (tempTop > 90)
                top = 90;

            // Não deixa o pássaro passar do teto
            else if (tempTop < 10)
                top = 10;

            else
                top = tempTop

            passaro.style.top = `${top}vh`
            interationCounter++
        }, tempo);

    return intervalo;
}

function MoverObstaculos(){
    const obstaculos = ObterObstaculos()

    if (!fimDoJogo){
        let intervalo = setInterval(() => {
            for (let obstaculo of obstaculos){
                const newXposition = Number(obstaculo.style.right.replace('vw','')) + 2
                obstaculo.style.right = `${newXposition}vw`
                VerificarFimDoJogo()
        
                if (newXposition > 100 && obstaculos.length > 0){
                    const elemento = document.getElementById(obstaculo.id)
                    elementoPrincipal.removeChild(elemento)

                    CalcularPontuacao()
                    clearInterval(intervalo)
                }
                else{
                    console.log(obstaculo.style.right);
                }
            }
        }, 80);
    }
}

function CalcularPontuacao(){
    contador.innerHTML = `${contadorObstaculos * 10} pontos`
}

function ObterObstaculos(){
    const children = [...elementoPrincipal.children]
    return children.filter(c => c.classList[0] === "obstaculo")
}