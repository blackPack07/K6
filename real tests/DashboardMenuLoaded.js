import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// 1. Create a custom metric to track the timing of the full menu-load journey
const menuLoadDuration = new Trend('menu_load_duration');

export const options = {
    // Run exactly 10 Virtual Users simultaneously
    vus: 10,
    duration: '30s', // Adjust total test duration as needed
    
    // 2. Define the strict SLA rule: 
    // "everytime" means even the slowest request (p(100)) must be under 5000ms (5s)
    thresholds: {
        'menu_load_duration': ['p(100) < 5000'], // 100% of responses must be < 5s
        'checks': ['rate == 1.0'],               // 100% of UI validation checks must pass
    },
};

export default function () {
    // --- STEP 1: Log In ---
    const config = JSON.parse(open('../Env-setup.json'));
    const loginUrl = `config.c_auth_url`;
    const loginPayload = JSON.stringify({
        username: 'test_user',
        password: 'secure_password',
    });
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const loginRes = http.post(loginUrl, loginPayload, params);
    
    // Ensure login succeeded before moving forward
    const loginPassed = check(loginRes, {
        'logged in successfully': (res) => res.status === 200,
    });

    if (!loginPassed) {
        console.error(`VU ${__VU} failed to log in.`);
        return; // Stop execution for this iteration if login fails
    }

    // --- STEP 2: Click Menu & Measure Journey ---
    const menuUrl = 'https://your-api-endpoint.com/menu/dashboard';
    
    // Start measuring the menu action specifically
    const startTime = Date.now();
    const menuRes = http.get(menuUrl);
    const endTime = Date.now();

    // Calculate how long it took in milliseconds
    const duration = endTime - startTime;
    menuLoadDuration.add(duration);

    // --- STEP 3: Validate the UI Loaded Successfully ---
    // Change 'Welcome' to a specific string or JSON field your menu endpoint returns
    check(menuRes, {
        'menu status is 200': (res) => res.status === 200,
        'menu UI content validated': (res) => res.body.includes('Welcome'), 
    });

    // Pacing: Rest the VU briefly before the next iteration
    sleep(1);
}