import http from 'k6/http'
// import report

export const options={
    stages:[
        {duration:'1m', target:250},
        {duration:'2m', target:300},
        {duration:'25s', target:0}
    ]
}

export default function () {
    http.get('https://test.k6.io');
}