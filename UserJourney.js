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

    sleep(2);

    group('Open News Page', () => {
        const response = http.get(`${BASE_URL}/news.php`);

        check(response, {
            'news page displayed well': (r) => r.status === 200,
        });
    });
    sleep(1);

    group('Open Blogs page', () => {
        const response = http.get(`${BASE_URL}/blog.php`);

        check(response, {
            'blog loaded': (r) => r.status === 200,
        });
    });

    check ( response, {
        'status is 500': (r) => r.status === 500,
    });
    sleep(1);
}

export function handleSummary(data_) {
    return {
        "gtm_UserJourney_report.html":htmlReport(data_),
    }
}