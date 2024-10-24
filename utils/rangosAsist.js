function definirRangos(dia) {
    let nextDia = new Date(dia);
    nextDia.setDate(nextDia.getDate() + 1);
    nextDia = nextDia.toISOString().split('T')[0];

    return {
        rangoM: [dia + 'T10:00:00.000', dia + 'T12:05:59.999'],
        rangoT: [dia + 'T18:00:00.000', dia + 'T20:05:59.999'],
        rangoN: [nextDia + 'T02:00:00.000', nextDia + 'T04:05:59.999'],
        rangoDelta: [dia + 'T22:00:00.000', nextDia + 'T00:05:59.999'],
        rangoAdmin: [dia + 'T11:00:00.000', dia + 'T13:05:59.999'],
    };
}

function consultarRango(hoy) {
    const hoyStrn = hoy.toISOString().split('T')[0];
    const hoyHora = hoy.getHours();
    const rangos = definirRangos(hoyStrn);

    switch (hoyHora) {
        case 7: return rangos.rangoM;
        case 8: return rangos.rangoAdmin;
        case 15: return rangos.rangoT;
        case 19: return rangos.rangoDelta;
        case 23: return rangos.rangoN;
        default: return 'En este horario no hay consulta...';
    }
}

module.exports = { definirRangos, consultarRango };
