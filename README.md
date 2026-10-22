# 🩸 BloodConnect MVP

> **"Find available blood nearby and quickly connect a patient with a verified hospital or donor."**

BloodConnect is a real-time blood finding and donation coordination platform designed to bridge the critical gap between patients in urgent need, verified blood centers/hospitals, and eligible voluntary donors.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or later
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📱 User Roles & Capabilities

### 1. 👤 Patient (Recipient / Attendant)
- **Phone Login**: Fast phone verification with 4-digit OTP.
- **Search Blood Inventory**: Search by blood group (A+, A-, B+, B-, O+, O-, AB+, AB-), component (*Red Blood Cells, Whole Blood, Platelets, Plasma*), units needed, and location.
- **Nearby Real-Time Stock**: View live hospital stocks with distance in km, unit counts, and real-time update timestamps.
- **Emergency Broadcast**: Create urgent blood requests with required-by urgency levels.
- **Live 4-Stage Request Tracker**: Track order progression from `Request Created` → `Donor/Hospital Found` → `Confirmation Pending` → `Fulfilled` with instant hotline calling.

### 2. 🩸 Voluntary Donor (e.g. Rahul • O+)
- **Availability Switch**: Toggle between `🟢 AVAILABLE` and `⚪ NOT AVAILABLE` to control emergency broadcast reception.
- **Matching Engine**: Automated compatibility filtering based on ABO/Rh compatibility, distance radius (5–10 km), and 90-day donation interval rules.
- **Urgent Request Alert**: Inspect request details (hospital, distance, urgency) and Accept or Decline.
- **Donor Privacy Guard**: Donor's personal phone number is never exposed publicly; hospital and routing information are revealed upon verification.

### 3. 🏥 Hospital / Blood Bank Staff (e.g. City Hospital)
- **Verified Center Portal**: View institution-wide inventory status.
- **Quick-Tap Inventory Matrix**: Tap any blood group to immediately adjust unit counts and save with an automatic timestamp.
- **Emergency Transfusion Queue**: Monitor active inbound requests, verify matched donor responses, confirm blood reserves, and dispense units to complete fulfillment.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Context API state store simulating real-time WebSockets and Firebase Cloud Messaging (FCM) notifications.
