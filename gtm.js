import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export default function () {
    const response = http.get('https://qspiders.com/');
    check(response, {
        'status should be 200':(r) => r.status === 200,
    }); 
    sleep(1);
}
// r is here response object

export const options = {
    vus: 10,
    duration: '5s',
};

export function handleSummary(data_) {
    return{
        "gtm_report.html":htmlReport(data_),
    }
}
