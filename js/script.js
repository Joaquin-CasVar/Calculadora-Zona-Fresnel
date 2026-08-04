const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const linkFrequency = parseFloat(document.getElementById('frequencyInput').value)
    const linkTotalDistance = parseFloat(document.getElementById('distanceInput').value)

    const antenna1Height = parseInt(document.getElementById('antenna1HeightInput').value)
    const antenna2Height = parseInt(document.getElementById('antenna2HeightInput').value)


    var obstructionHeight = parseInt(document.getElementById('obstructionHeightInput').value)
    const obstructionDistance = parseFloat(document.getElementById('obstructionDistanceInput').value) // if not assume midpoint

    if (!obstructionHeight) {
        obstructionHeight = 0
    }

    var totalObstruction, totalClearance

    if (obstructionDistance) {
        // distancia de la antena 1 al obstaculo
        const distance1 = obstructionDistance
        // distancia de la antena 2 al obstaculo
        const distance2 = linkTotalDistance - obstructionDistance
        const radius = calcularRadio(linkFrequency, distance1, distance2)

        totalClearance = calcularClearance(antenna1Height, antenna2Height, linkTotalDistance, obstructionDistance)

        if (distance1 <= distance2) {
            totalObstruction = calcularObstruccion(radius, obstructionHeight, distance1)
        } else {
            totalObstruction = calcularObstruccion(radius, obstructionHeight, distance2)
        }

        calcularAntenasDiferentes(radius, totalObstruction, totalClearance)
    } else {
        const radiusMidpoint = calcularRadioPuntoMedio(linkFrequency, linkTotalDistance)
        
        totalObstruction = calcularObstruccion(radiusMidpoint, obstructionHeight, (linkTotalDistance / 2))
        totalClearance = calcularClearance(antenna1Height, antenna2Height, linkTotalDistance, (linkTotalDistance / 2))

        calcularAntenasDiferentes(radiusMidpoint, totalObstruction, totalClearance)
    }
})

const calcularRadioPuntoMedio = (freq, dist) => {
    const radius = (8.656 * Math.sqrt(dist / freq))

    //                                                  truncate float to 2 decimals
    document.getElementById('radius').innerHTML = String(radius).replace(/(\.\d\d)\d+/, "$1") + 'm'

    return radius;
}

const calcularRadio = (freq, dist1, dist2) => {
    const radius = 17.312 * Math.sqrt((dist1 * dist2) / (freq * (dist1 + dist2)))

    //                                                  truncate float to 2 decimals
    document.getElementById('radius').innerHTML = String(radius).replace(/(\.\d\d)\d+/, "$1") + 'm'

    return radius;
}

const calcularClearance = (a1h, a2h, totalDist, distObst) => {
    const diffH = Math.abs(a1h - a2h)

    // º = sin^-1(H' / D)
    const angle = Math.asin(diffH / (totalDist * 1000))

    const diffAtObst = Math.sin(angle) * distObst * 1000

    var clearance
    if (a1h <= a2h) {
        clearance = a1h + diffAtObst
    } else {
        clearance = a2h + diffAtObst
    }

    return clearance
}

const calcularObstruccion = (radius, obstacleHeight, dist) => {
    const obstruccion = radius + obstacleHeight
    return obstruccion
}

const calcularAntenasDiferentes = (radius, totalObstructionHeight, totalClearanceHeight) => {
    const obstructionInRadius = totalObstructionHeight - totalClearanceHeight;


    var prcntObstruction = Math.trunc((obstructionInRadius / radius) * 100)
    var sigInt = ''


    if (prcntObstruction <= 0) {
        prcntObstruction = 0
        sigInt = 'Excelente'
    } else if (prcntObstruction <= 20) {
        sigInt = 'Excelente'
    } else if (prcntObstruction <= 40) {
        sigInt = 'Regular'
    } else {
        if (prcntObstruction > 100) {
            prcntObstruction = 100
        }
        sigInt = 'Crítica'
    }


    document.getElementById('obstPrcnt').innerHTML = prcntObstruction + '%'
    document.getElementById('sigInt').innerHTML = sigInt
}

