export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunk = []
    for (let i = 0; i < array.length; i += size) {
        const slice = array.slice(i, i + size)
        chunk.push(slice)
    }
    return chunk
}

export const generateUUID = (): string => {
  // Generate a random UUID (version 4)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));