export default function requestToServer(options) {
    return new Promise((resolve, reject) => {
        const { data, method } = options;
        const url = 'http://localhost:7070';
        const params = new URLSearchParams();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                params.append(key, data[key]);
            }
        }
        const xhr = new XMLHttpRequest();
        if (method === 'GET') {
            xhr.open('GET', `${url}?${params}`);
            xhr.send();
        } else if (method === 'POST') {
            xhr.open('POST', `${url}?${params}`);
            xhr.send(params);
        } else if (method === 'PUT') {
            xhr.open('PUT', `${url}?${params}`);
            xhr.send(params);
        } else if (method === 'DELETE') {
            xhr.open('DELETE', `${url}?${params}`);
            xhr.send();
        }
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(console.error(`Ошибка ${xhr.status}`));
            }
        });
    });
}