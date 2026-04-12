import { sleep, check } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

export const options = {
    vus: 10,
    duration: '2s',
    thresholds: {
        http_req_duration: ['p(90)<200']
    },
}
export default function () {
    const response = http.get(BASE_URL);
    check ( response, {
        'status will be 200': (r) => r.status === 200,
    });
    sleep(1);
}

export function handleSummary(data_) {
    return {
        "gtm_threshold_report.html":htmlReport(data_),
    }
}