# K6
# 🚀 Grafana k6 Performance Testing Portfolio

## 📌 Overview
This repository contains my practical implementations and proof-of-concept scripts for API load and performance testing using **Grafana k6**. Coming from a functional UI and API automation background, this project demonstrates my ability to engineer performance test suites, establish performance SLAs, and generate stakeholder-friendly visual reports.

## 🛠️ Tech Stack & Tools
* **Load Testing Framework:** Grafana k6
* **Language:** JavaScript (ES6)
* **Reporting:** Custom HTML Dashboards (via `benc-uk/k6-reporter`)

## 📂 Key Concepts Demonstrated
The scripts in this repository are broken down to showcase specific performance testing methodologies:

* **`gtm.js`**: Baseline API functional validation combined with simple load generation.
* **`RampUpDown.js`**: Implementation of k6 `stages` to simulate realistic user traffic curves, including gradual traffic spikes (ramp-up) and graceful server cooldowns (ramp-down).
* **`Thresholds.js`**: Establishing strict Service Level Agreements (SLAs) using k6 thresholds (e.g., ensuring 95th percentile response times remain under a specific millisecond limit).
* **`UserJourney.js`**: Simulating complete, end-to-end human workflows rather than hitting isolated API endpoints.
* **`TrafficDistribution.js`**: Utilizing k6 `scenarios` to distribute Virtual Users (VUs) across different tasks based on real-world percentages (e.g., simulating 70% of users browsing vs. 30% checking out).

## 📊 Reporting & Dashboards
Raw terminal output can be difficult for non-technical stakeholders to read. To solve this, I have integrated a custom HTML reporter into the framework. 

When a test completes, it automatically parses the k6 metrics and generates an interactive, offline HTML dashboard. Examples of these outputs can be found in the repository (e.g., `gtm_TrafficDistribution_report.html`).

## 🚀 How to Run Locally
1. Ensure [k6 is installed](https://k6.io/docs/get-started/installation/) on your machine.
2. Clone this repository.
3. Open your terminal in the root directory.
4. Execute any script using the k6 CLI:
   ```bash
   k6 run TrafficDistribution.js
