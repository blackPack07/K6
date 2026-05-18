import http from 'k6/http'
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

const config = JSON.parse(open('../Env-setup.json'));

export const options={
    vus:10,
    iterations:20
}

let headers={
    'Authorization':`Bearer ${config.gorest_header_token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

export default function () {
    // const res = http.get(config.rev_gorest_header_url, {headers:headers});
    const res = http.get('https://httpbin.test.k6.io/bearer', { headers: headers });
    console.log(`Status: ${res.status} | Body: ${res.body}`);
    check( res, {
         "status code is validated ": (res)=>res.status === 200,
    })
}

export function handleSummary(data) {
    const reportFilename = "../reports/revision_report.html"; 

    return {
        [reportFilename]: htmlReport(data),
    };
}