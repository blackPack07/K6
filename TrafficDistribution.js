import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

const TRAFFIC_SPLIT = {
    home: 0.6,
    news: 0.1,
    blog: 0.3,
};

export const options = {
    stages:[
        {duration:'7s', target:50},
        {duration:'10s', target:70},
        {duration:'5s', target:0},    ],
}

export default function () {
    const random = Math.random();
    if (random < TRAFFIC_SPLIT.home){
        const response = http.get(BASE_URL);
        group('Open Home Page', ()=>{
            const response = http.get(BASE_URL);
            check ( response, {
                'home loaded': (r) => r.status === 200,
            });
            sleep(1);
        });
    } else if (random < TRAFFIC_SPLIT.home + TRAFFIC_SPLIT.blog) {
        group('Open News Page', () => {
            const response = http.get(`${BASE_URL}/news.php`);

            check(response, {
                'news page displayed well': (r) => r.status === 200,
            });
        });
        sleep(1);
    } else {
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
}

export function handleSummary(data_) {
    return {
        "gtm_TrafficDistribution_report.html":htmlReport(data_),
    }
}