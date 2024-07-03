export function logInfo(message, data = null) {
    console.log(message);
    if (data) {
        console.log(data);
    }
}

export function logError(message, error = null) {
    console.error(message);
    if (error) {
        console.error(error);
    }
}