import http from 'k6/http'
// import report

export default function () {
    http.get('https://test.k6.io');
}