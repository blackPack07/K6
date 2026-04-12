import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

export const options = {
    stages:[
        {duration:'7s', target:50},
        {duration:'10s', target:70},
        {duration:'5s', target:0},    ],
}

export default function () {
    const response = http.get(BASE_URL);
    group('Open Home Page', ()=>{
        const response = http.get(BASE_URL);
        check ( response, {
            'status is 200': (r) => r.status === 200,
        });
        sleep(1);
    });

    check ( response, {
        'status is 500': (r) => r.status === 500,
    });
    sleep(1);
}

export function handleSummary(data_) {
    return {
        "gtm_rampUpDown_report.html":htmlReport(data_),
    }
}