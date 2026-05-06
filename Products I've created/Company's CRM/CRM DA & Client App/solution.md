### **High-Level Overview**

The solution is a standalone **Mobile Application** (separate from, but complementary to, the existing Locus app) designed specifically for **Delivery Agents (DAs)**. Its primary function is to act as a "Gatekeeper" for non-delivery reporting.

The system shifts the paradigm from **"DAs reporting cancellations"** to **"DAs logging validated issues"**. It enforces strict digital proof (Location + Time + Evidence) before a delivery failure can be officially recorded, thereby providing the Finance/Sales teams with indisputable **"Proof of Attempt"** to secure immediate invoicing.

---

### **Core Features & Functional Modules**

### **1. Simplified Authentication & Tour Retrieval**

- **Feature:** Phone Number-Based Login.
- **Logic:** The DA does not need complex credentials. They simply input their registered phone number.
- **Backend Action:** The system queries the central Database (Ashraf’s DB) to fetch the specific **"Tour" (Route)** assigned to that phone number for the current day.
- **Benefit:** Reduces friction for the DA while ensuring they can only interact with their assigned orders.

### **2. Geo-Spatial Validation (The "Geo-Fence" Lock)**

- **Feature:** Location-Based Cancellation Unlocking.
- **Logic:** The application compares the DA’s current **GPS Latitude & Longitude** against the target **Merchant/Client Location** stored in the system.
- **Constraint:** A DA **cannot** initiate a "Cancellation" or "Issue Report" unless they are physically inside the geofence of the delivery destination.
- **Benefit:** Eliminates "Fake Attempts" where DAs mark orders as failed while sitting at a warehouse or coffee shop.

### **3. Time-Stamp & Wait Time Verification**

- **Feature:** The "30-Minute Rule" Tracker.
- **Logic:** For reasons related to "Merchant Delay" or "Client Unreachable," the system calculates the time elapsed since the DA entered the geofence.
- **Constraint:** If the SLA requires a 30-minute wait, the "Cancel" button remains disabled until that timer expires.
- **Benefit:** Provides digital proof that the DA respected the wait-time contract, preventing Clients from disputing the attempt.

### **4. Standardized Issue Categorization (No Free Text)**

- **Feature:** Pre-set Dropdown Reasons.
- **Logic:** To prevent DAs from writing vague excuses or offensive language (insults via WhatsApp), the app provides a strict list of categorized reasons (e.g., "Shop Closed," "Refused Payment," "Wrong Items").
- **Handling "Other":** If a DA selects "Other," it triggers a secondary flow (potentially reviewed by AI or a Supervisor) rather than going directly to the client as raw text.
- **Benefit:** Clean data for analytics and professional communication with clients.

### **5. Digital Evidence Collection**

- **Feature:** Mandatory Proof Upload.
- **Logic:** Before finalizing a cancellation, the DA must provide evidence depending on the reason selected.
    - *Example:* Photo of the closed shop shutter.
    - *Example:* Photo of the location (Proof of presence).
- **Benefit:** Creates a visual Audit Trail that stands up to scrutiny during financial reconciliation.

### **6. Real-Time Client & Sales Visibility**

- **Feature:** Instant "Flagging" Notification.
- **Logic:** Instead of the Client finding out days later, the moment a DA logs a specific issue (e.g., "Client Refused"), a notification is pushed to a Viewer Dashboard accessible by the Sales Team or the Client directly.
- **Benefit:** Allows for **Live Intervention**. If a DA falsely claims "Client Refused," the Client gets notified immediately and can dispute it while the DA is still on-site or nearby.

---

### **The Proposed User Flow (The "Happy Path")**

1. **Arrival:** The DA arrives at the Merchant/Client location.
2. **Issue Encountered:** The DA realizes they cannot deliver (e.g., Shop is closed).
3. **App Switch:** The DA opens the **Issue Tracker App** (switching from Locus).
4. **Tour Fetch:** DA enters their phone number; the app loads their current list of orders.
5. **Select Order:** DA selects the specific order facing the issue.
6. **Validation Check (System):**
    - *System asks:* "Is GPS matches Order Location?" -> **YES**.
    - *System asks:* "Has the required wait time passed?" -> **YES**.
7. **Reporting:** The App unlocks the "Report Issue" button.
8. **Data Entry:** DA selects "Shop Closed" from the dropdown and takes a photo of the shop.
9. **Submission:** DA submits the report.
10. **Result:**
    - The Order is flagged in the Database.
    - Locus is updated (indirectly/later) with the correct status.
    - The Client/Sales team receives a notification: *"Order X attempted at [Time] but failed due to [Reason]. Proof attached."*

---

### **Technical Architecture (Based on Transcript)**

- **Data Source:** The app does not maintain its own order database; it views/fetches data from the existing central Database (Ashraf's DB).
- **Sync Frequency:**
    - *Current Constraint:* The main DB updates every 15 minutes.
    - *Target:* To achieve near real-time updates via Webhooks or frequent polling (e.g., every 5-10 seconds while the app is open) to ensure the DA sees the correct status.
- **Integration:** The solution acts as a "Sidecar" to Locus. It reads Locus data (Order details/Location) but writes the "Cancellation Logic" separately to ensure integrity before pushing the final status back to the core system.

### **Strategic Goal of the Solution**

To transform the **Account Receivables (AR)** conversation from "We think we delivered" to **"Here is the digital proof (Time + Location + Photo) that we attempted delivery, therefore the invoice is valid and payable."**
