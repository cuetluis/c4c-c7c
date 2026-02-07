export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US');
};

export const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const isValidHexColor = (hex: string): boolean => {
    const regex = /^#([0-9A-F]{3}){1,2}$/i;
    return regex.test(hex);
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};