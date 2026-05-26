
## 🕵️‍♂️ Digital Shadow Analyzer

"What does the web know about you when you're just looking?"

Digital Shadow Analyzer is a high-intensity, terminal-style React application designed to visualize the silent data collection occurring in modern browsers. By aggregating hardware telemetry, network metadata, and cryptographic canvas fingerprinting, it generates a comprehensive profile of your "Digital Shadow."


------------------------------
## ⚡ Core Features## 1. Advanced Fingerprinting

* Canvas & WebGL Identity: Uses off-screen rendering to generate a unique cryptographic hash based on your GPU's specific geometry and text-rendering artifacts.
* Hardware Telemetry: Extracts CPU core counts, device memory, battery health, and GPU vendor/renderer details.
* Network Intelligence: Dual-layered IP geolocation (via ipapi.co and ip-api.com) revealing ISP, ASN, and precise coordinates.

## 2. The "Hacker" Interface

* Boot Sequence: A dramatic, animated terminal initialization built with Framer Motion.
* Real-time Scan: Watch as the system systematically probes your browser API for cookies, history length, and touch points.
* Privacy Scoring: A dynamic algorithm that calculates your "leakage level" based on the uniqueness of your data.

## 3. Shareable Privacy Cards

* Instant Export: Generate a PNG "Security Report" of your shadow using html2canvas to share with others and raise privacy awareness.

------------------------------
## 🛠 Tech Stack

* Frontend: Vite + React 18
* Styling: Tailwind CSS (JIT)
* Animations: Framer Motion
* Fonts: JetBrains Mono & Share Tech Mono
* External APIs: ipapi.co (Primary), ip-api.com (Fallback)


## 🛡 Privacy Policy & Disclaimer
This tool is for educational and diagnostic purposes only.

* Zero Storage: All data collected is stored strictly in local state. No data is sent to a backend server (other than the standard GET requests to the Geo-IP providers).
* Transparency: The goal of this project is to demonstrate how "browser fingerprinting" works so users can better protect themselves via VPNs or privacy-hardened browsers (like Brave or Mullvad).

------------------------------
## 🤝 Affiliate Partners
Looking to shrink your shadow? Consider these privacy-first tools:

* NordVPN - Military-grade encryption.
* ExpressVPN - High-speed anonymity.
* Mullvad VPN - The gold standard in privacy.

------------------------------
Do you want me to add a specific section for "Environment Variables" or a "Project Structure" breakdown to this file?

