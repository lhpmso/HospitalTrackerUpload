export function url(partial) {
    //console.log(window.location.hostname)
    switch (window.location.hostname) {
        case 'localhost':
            //return 'https://localhost:5002/api/' + partial
            return 'https://lhp-ws-development.azurewebsites.net/api/' + partial
        case 'lhp-hospital-dw.azurewebsites.net':
            return 'https://lhp-ws.azurewebsites.net/api/' + partial
        case 'lhp-hospital-dw-development.azurewebsites.net':
            return 'https://lhp-ws-development.azurewebsites.net/api/' + partial
        default:
            return 'https://localhost:5002/api/' + partial
    }
}