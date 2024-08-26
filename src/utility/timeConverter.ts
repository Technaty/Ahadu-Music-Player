export function timeConverter(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minutesString}:${secondsString}`
}