import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const menuLoadDuration = new Trend('menu_load_duration');

export const options = {
    vus: 10,
    duration: '30s',

    thresholds: {
        'menu_load_duration': ['p(100) < 5000'],
        'checks': ['rate == 1.0'],
    },
};

export default function () {
    const config = JSON.parse(open('../Env-setup.json'));
    const loginUrl = `__ENV.DASHBOARD_MENU_URL`;
    const loginPayload = JSON.stringify({
        username: 'test_user',
        password: 'secure_password',
    });
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const loginRes = http.post(loginUrl, loginPayload, params);
    
    const loginPassed = check(loginRes, {
        'logged in successfully': (res) => res.status === 200,
    });

    if (!loginPassed) {
        console.error(`VU ${__VU} failed to log in.`);
        return;
    }
    const menuUrl = `__ENV.DASHBOARD_MENU_URL${home}`;
    
    const startTime = Date.now();
    const menuRes = http.get(menuUrl);
    const endTime = Date.now();

    const duration = endTime - startTime;
    menuLoadDuration.add(duration);

    check(menuRes, {
        'menu status is 200': (res) => res.status === 200,
        'menu UI content validated': (res) => res.body.includes('Welcome'), 
    });
    sleep(1);
}