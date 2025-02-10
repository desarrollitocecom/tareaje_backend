// Usamos Jaro-Winkler para la similitud de cadenas :
const { JaroWinklerDistance } = require('natural');

// Función de Levenshtein para determinar la similitud entre cadenas de texto :
const levenshtein = (a, b) => {
    
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = a[i - 1] === b[j - 1] ? 
                matrix[i - 1][j - 1] : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
        }
    }
    return matrix[a.length][b.length];
};

// Función para encontrar el elemento más similar con Jaro-Winkler
const searchBestSimilarity = (general, datos, umbral = 0.88) => {
    const result = datos.reduce((closest, dato) => {
        const similarity = JaroWinklerDistance(general, dato);

        if (!closest || similarity > closest.similarity) {
            return { dato, similarity };
        }
        return closest;
    }, null);

    return result && result.similarity >= umbral ? result : null;
};

module.exports = { searchBestSimilarity };
