### **1. High-Level Function Purpose**

This Edge Function acts as a **"Resolver" or "Bridge."**

Its specific job is to take a **Driver's Phone Number** and find out **"What is his current Tour?"** and **"What are the Orders inside this Tour?"**

It does **not** call the Locus API endpoints (like the JSONs we analyzed earlier). Instead, it queries a **Data Warehouse (AWS RDS - PostgreSQL)** called locus_dw_recover, which contains a flattened history of Locus data.

---

### **2. Step-by-Step Logic Breakdown**

### **Step A: Input & Sanitization**

1. **Input:** Receives rider_phone_number (e.g., 01xxxxxxxxx).
2. **Formatting:** Uses formatPhoneNumber to convert it to the international format stored in the database (e.g., +201xxxxxxxxx).
    - *Why this matters:* You don't need to parse actor.id from the JSON files anymore. This function handles the identity verification.

### **Step B: Finding the Tour (The "Parent")**

1. **Connection:** Connects to AWS RDS (locus_dw_recover).
2. **Query 1 (Tour Lookup):**
    - It looks into the table order_all.
    - It filters by "order_tourDetail_riderNumber".
    - It sorts by Date (DESC) and takes LIMIT 1.
    - **Result:** It gets the **Latest Active tour_id** assigned to this driver (plus vehicle/plate details).

### **Step C: Finding the Orders (The "Children")**

1. **Query 2 (Order Lookup):**
    - It uses the tour_id found in Step B.
    - It queries order_all again to find every row that has that tour_id.
    - **Deduplication:** Since order_all seems to be a flattened table (likely containing duplicates for multiple statuses or line items), the code creates a Map to ensure each order_id is listed only once.

### **Step D: Syncing to Your Local DB (Supabase)**

This is crucial. It doesn't just return data; it **saves state** to your own system:

1. **Upsert Tour:** Saves the Tour ID and Driver info into your Supabase tours table.
2. **Warehouse Mapping:** Checks which Homebase (Warehouse) these orders belong to.
3. **Upsert Orders:** Saves the link between tour_id and order_id into tour_orders.

### **Step E: The Response**

It returns a clean JSON containing:

- tour_id (The Locus ID).
- linked_orders (An array of Order IDs, e.g., ['SO-151930', 'NUZZ1168']).

---

### **3. How We Will Build Upon This (The Integration Strategy)**

This Edge Function solves the **"Who am I and what orders do I have?"** problem.

The JSON analysis we did earlier solves the **"What is the real-time status of this specific order?"** problem.

Here is the proposed flow combining both:

1. **Login (Existing Edge Function):**
    - DA opens the App -> Enters Phone Number.
    - This Edge Function runs -> Returns tour_id and a list of ['SO-151930', 'SO-151931'].
2. **Fetch Details (New Logic):**
    - The App takes the list of Order IDs (e.g., SO-151930).
    - **The Missing Piece:** The App (or a new Edge Function) loops through these IDs and calls the **Locus API Endpoint** (the one we analyzed: https://locus-api.com/.../task/SO-151930).
3. **Why do we need the Endpoint if we have the DB?**
    - **Latency:** The AWS RDS (locus_dw_recover) is likely a Data Warehouse, which might have a sync delay (15 mins to 1 hour).
    - **Accuracy:** To validate the **"30-Minute Rule"** and **"Live Arrival,"** we need the exact statusUpdates and triggerTime from the live API JSON, not the potentially stale DB record.

### **4. Summary of Data Flow**

1. **Input:** Phone Number.
2. **Edge Function:** Query RDS -> Get **List of Order IDs**.
3. **Next Step (Your New Integration):** Use these **Order IDs** to fetch the detailed JSON payload (Target Lat/Lng, Arrival Time) to perform the Geo-fencing & Time checks.
