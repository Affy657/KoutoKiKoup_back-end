export function createRandomStringTimeBased(size: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = Date.now().toString();
    for (let i = 0; i < (size - randomString.length); i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString
}