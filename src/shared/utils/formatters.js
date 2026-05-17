export const obfuscateId = (id) => {
    if (!id) return 'N/A';
    // Muestra los últimos 5 caracteres
    return `***${id.slice(-5).toUpperCase()}`;
};