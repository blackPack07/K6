import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// --- INIT STAGE (Runs once) ---
// This reads your JSON template into memory immediately
const config = JSON.parse(open('../Env-setup.json'));

const menuLoadDuration = new Trend('menu_load_duration');

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        'menu_load_duration': ['p(100) < 5000'],
        'checks': ['rate == 1.0'],
    },
};

// --- VU STAGE (Runs repeatedly) ---
export default function () {
    // 1. Pulling the URL right out of your config object!
    const loginUrl = `${__ENV.DASHBOARD_MENU_URL}/login`; 
    
    // 2. Pulling credentials straight from your JSON file!
    const loginPayload = JSON.stringify({
        username: __ENV.TEST_USER,
        password: __ENV.TEST_PASSWORD,
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

    // 3. Constructing the menu endpoint via config properties
    const menuUrl = `${config.dashboard_page_url}/home`;
    
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