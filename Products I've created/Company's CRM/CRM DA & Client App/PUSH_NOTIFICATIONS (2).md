# Web Push Notifications - Complete Implementation Guide

This document provides a comprehensive, step-by-step guide to implementing Web Push Notifications in any project using Supabase Edge Functions. The implementation is generic and can be adapted to any database structure and user types.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Implementation](#step-by-step-implementation)
   - [Step 1: Generate VAPID Keys](#step-1-generate-vapid-keys)
   - [Step 2: Add Secrets to Supabase](#step-2-add-secrets-to-supabase)
   - [Step 3: Create Database Table](#step-3-create-database-table)
   - [Step 4: Create Service Worker](#step-4-create-service-worker)
   - [Step 5: Create Edge Functions](#step-5-create-edge-functions)
   - [Step 6: Create React Hook](#step-6-create-react-hook)
   - [Step 7: Create Helper Function](#step-7-create-helper-function)
   - [Step 8: Integrate in Your App](#step-8-integrate-in-your-app)
5. [Sending Notifications](#sending-notifications)
6. [Event-Triggered Notifications](#event-triggered-notifications)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Web Push Notifications allow you to send notifications to users even when they're not actively using your app. This implementation uses:

- **VAPID (Voluntary Application Server Identification)**: Industry standard for push notification authentication
- **Service Workers**: Background scripts that handle push events
- **Supabase Edge Functions**: Serverless functions to manage subscriptions and send notifications
- **@pushforge/builder**: A lightweight library for building Web Push HTTP requests

### Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Edge (Desktop & Android) | ✅ Full support |
| Firefox | ✅ Full support |
| Safari (macOS 13+, iOS 16.4+) | ✅ Partial support |
| Opera | ✅ Full support |
| Samsung Internet | ✅ Full support |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌─────────────────┐     ┌─────────────────────────┐  │
│  │   Browser    │     │   Edge Function  │     │    Push Service         │  │
│  │              │     │                  │     │  (FCM/Mozilla/Apple)    │  │
│  │  ┌────────┐  │     │  ┌────────────┐  │     │                         │  │
│  │  │  App   │──┼────►│  │ register-  │  │     │                         │  │
│  │  │        │  │     │  │ push-sub   │──┼────►│  Stores subscription    │  │
│  │  └────────┘  │     │  └────────────┘  │     │                         │  │
│  │              │     │                  │     │                         │  │
│  │  ┌────────┐  │     │  ┌────────────┐  │     │  ┌─────────────────┐   │  │
│  │  │Service │◄─┼─────┼──│send-push-  │◄─┼─────┼──│ Delivers to     │   │  │
│  │  │Worker  │  │     │  │notification│  │     │  │ user's device   │   │  │
│  │  └────────┘  │     │  └────────────┘  │     │  └─────────────────┘   │  │
│  └──────────────┘     └─────────────────┘     └─────────────────────────┘  │
│                                                                              │
│                       ┌─────────────────┐                                    │
│                       │    Supabase     │                                    │
│                       │    Database     │                                    │
│                       │                 │                                    │
│                       │ push_           │                                    │
│                       │ subscriptions   │                                    │
│                       └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow Summary

1. **Subscribe**: User grants permission → Browser creates subscription → Save to database
2. **Send**: Trigger event → Fetch subscription from database → Build encrypted request → Send to push service
3. **Receive**: Push service delivers to browser → Service worker shows notification → User clicks → Navigate to app

---

## Prerequisites

Before starting, ensure you have:

- A Supabase project with Edge Functions enabled
- Node.js installed (for VAPID key generation)
- A PWA-capable web application

---

## Step-by-Step Implementation

### Step 1: Generate VAPID Keys

VAPID keys are used to identify your server to push services. Generate them once and keep them secure.

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

This outputs:
```
=======================================

Public Key:
BLc-mG1n6kBw...

Private Key:
dGhpcyBpcyBh...

=======================================
```

**⚠️ Important**: Save both keys securely. The private key should NEVER be exposed to the client.

---

### Step 2: Add Secrets to Supabase

Add the VAPID keys as secrets in your Supabase project:

1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add:
   - `VAPID_PUBLIC_KEY`: Your public key
   - `VAPID_PRIVATE_KEY`: Your private key

Or use the Supabase CLI:
```bash
supabase secrets set VAPID_PUBLIC_KEY="BLc-mG1n6kBw..."
supabase secrets set VAPID_PRIVATE_KEY="dGhpcyBpcyBh..."
```

---

### Step 3: Create Database Table

Create a table to store push subscriptions:

```sql
-- Create push_subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,                    -- Your user identifier
  user_type TEXT NOT NULL,                  -- e.g., 'client', 'driver', 'admin'
  endpoint TEXT NOT NULL,                   -- Push service URL
  p256dh TEXT NOT NULL,                     -- Public encryption key
  auth TEXT NOT NULL,                       -- Authentication secret
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_push_subscriptions_user 
ON public.push_subscriptions(user_id, user_type);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions
FOR ALL
USING (true);  -- Adjust based on your authentication setup
```

**Customization Notes**:
- Replace `user_id TEXT` with `user_id UUID REFERENCES auth.users(id)` if using Supabase Auth
- Add additional columns like `device_name`, `platform`, etc. as needed
- Adjust RLS policies based on your security requirements

---

### Step 4: Create Service Worker

Create `public/sw-push.js` in your public folder:

```javascript
// Push notification handler
// This file must be in the public folder at the root level

self.addEventListener('push', (event) => {
  console.log('[SW-Push] Push event received');
  
  // Default notification data
  let data = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/icons/icon-192.png',      // Update with your icon path
    badge: '/icons/icon-192.png',     // Update with your badge path
    data: { url: '/' }
  };
  
  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        data: payload.data || data.data
      };
    }
  } catch (e) {
    console.error('[SW-Push] Error parsing push data:', e);
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],           // Vibration pattern
    data: data.data,
    dir: 'ltr',                          // Change to 'rtl' for RTL languages
    lang: 'en',                          // Change based on your app language
    tag: data.data?.tag || 'notification-' + Date.now(),
    renotify: true,                      // Show notification even if same tag exists
    requireInteraction: true,            // Don't auto-dismiss
    silent: false,
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  // If user clicked "close" action, do nothing
  if (event.action === 'close') {
    return;
  }
  
  // Get URL from notification data or default to home
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if app is already open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
```

---

### Step 5: Create Edge Functions

You need three edge functions:

#### 5.1 Get VAPID Public Key

Create `supabase/functions/get-vapid-public-key/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');

    if (!VAPID_PUBLIC_KEY) {
      console.error('[get-vapid-public-key] VAPID_PUBLIC_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'VAPID public key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ publicKey: VAPID_PUBLIC_KEY }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[get-vapid-public-key] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### 5.2 Register Push Subscription

Create `supabase/functions/register-push-subscription/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle subscription registration
    if (req.method === 'POST') {
      const { user_id, user_type, endpoint, p256dh, auth } = await req.json();

      console.log('[register-push] Registering subscription for:', { user_id, user_type });

      if (!user_id || !user_type || !endpoint || !p256dh || !auth) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete existing subscriptions for this user (prevent duplicates)
      // This ensures only ONE subscription per user
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user_id)
        .eq('user_type', user_type);

      // Insert the new subscription
      const { data, error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id,
          user_type,
          endpoint,
          p256dh,
          auth
        })
        .select()
        .single();

      if (error) {
        console.error('[register-push] Error saving subscription:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save subscription' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[register-push] Subscription saved successfully');
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle subscription removal
    if (req.method === 'DELETE') {
      const { user_id, user_type } = await req.json();

      console.log('[register-push] Deleting subscriptions for:', { user_id, user_type });

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user_id)
        .eq('user_type', user_type);

      if (error) {
        console.error('[register-push] Error deleting subscription:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete subscription' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[register-push] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### 5.3 Send Push Notification

Create `supabase/functions/send-push-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildPushHTTPRequest } from "https://esm.sh/@pushforge/builder@1.1.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  user_id: string;
  user_type: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

// Convert base64url VAPID keys to JWK format for WebCrypto
async function vapidKeysToJWK(publicKeyBase64: string, privateKeyBase64: string) {
  const base64urlToBytes = (base64url: string): Uint8Array => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(base64 + padding);
    return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
  };

  const publicKeyBytes = base64urlToBytes(publicKeyBase64);
  const privateKeyBytes = base64urlToBytes(privateKeyBase64);

  // VAPID public key is 65 bytes (uncompressed P-256 point: 0x04 || x || y)
  const x = publicKeyBytes.slice(1, 33);
  const y = publicKeyBytes.slice(33, 65);

  const bytesToBase64url = (bytes: Uint8Array): string => {
    const binary = String.fromCharCode(...bytes);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  return {
    kty: 'EC',
    crv: 'P-256',
    x: bytesToBase64url(x),
    y: bytesToBase64url(y),
    d: bytesToBase64url(privateKeyBytes),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get VAPID keys
    const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
    const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.error('[send-push] VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'VAPID keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert VAPID keys to JWK format
    const privateJWK = await vapidKeysToJWK(VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: PushPayload = await req.json();
    const { user_id, user_type, title, body, url, tag } = payload;

    console.log('[send-push] Request:', { user_id, user_type, title });

    if (!user_id || !user_type || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get subscriptions for this user
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('user_type', user_type);

    if (error) {
      console.error('[send-push] Error fetching subscriptions:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[send-push] No subscriptions found for user:', user_id);
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notification payload
    const notificationPayload = {
      title,
      body,
      icon: '/icons/icon-192.png',    // Update with your icon
      badge: '/icons/icon-192.png',   // Update with your badge
      data: { 
        url: url || '/', 
        tag: tag || 'notification-' + Date.now()
      }
    };

    let sentCount = 0;
    const failedEndpoints: string[] = [];

    // Send to each subscription
    for (const sub of subscriptions) {
      try {
        const { endpoint, headers, body: pushBody } = await buildPushHTTPRequest({
          privateJWK,
          message: {
            payload: notificationPayload,
            options: { 
              ttl: 86400,      // 24 hours
              urgency: "high" 
            },
            adminContact: "mailto:admin@yourapp.com"  // Update with your email
          },
          subscription: {
            endpoint: sub.endpoint,
            keys: { 
              p256dh: sub.p256dh, 
              auth: sub.auth 
            }
          }
        });

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: pushBody
        });

        if (response.ok || response.status === 201) {
          sentCount++;
        } else {
          // Handle expired subscriptions
          if (response.status === 410 || response.status === 404) {
            failedEndpoints.push(sub.endpoint);
          }
        }
      } catch (pushError) {
        console.error('[send-push] Error sending:', pushError);
      }
    }

    // Clean up expired subscriptions
    if (failedEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        failed: failedEndpoints.length,
        total: subscriptions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[send-push] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

### Step 6: Create React Hook

Create `src/hooks/usePushNotifications.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}

// Convert base64url to Uint8Array (required for applicationServerKey)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Fetch VAPID public key from your edge function
async function getVapidPublicKey(): Promise<string | null> {
  try {
    const response = await fetch(
      'https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-vapid-public-key',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_ANON_KEY`
        }
      }
    );

    if (!response.ok) {
      console.error('[Push] Failed to fetch VAPID public key');
      return null;
    }

    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error('[Push] Error fetching VAPID public key:', error);
    return null;
  }
}

export function usePushNotifications(
  userId: string | null,
  userType: string | null
): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check browser support
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 
                      'PushManager' in window && 
                      'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
    
    setIsLoading(false);
  }, []);

  // Register service worker
  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker.register('/sw-push.js')
      .then((registration) => {
        console.log('[Push] Service worker registered');
      })
      .catch((error) => {
        console.error('[Push] Service worker registration failed:', error);
      });
  }, [isSupported]);

  // Check if already subscribed
  useEffect(() => {
    if (!isSupported || !userId) return;

    navigator.serviceWorker.ready.then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    });
  }, [isSupported, userId]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !userId || !userType) {
      return false;
    }

    try {
      setIsLoading(true);

      // Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        console.log('[Push] Permission denied');
        return false;
      }

      // Get VAPID public key
      const vapidPublicKey = await getVapidPublicKey();
      if (!vapidPublicKey) {
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      });

      // Extract subscription details
      const subscriptionJson = subscription.toJSON();
      const endpoint = subscriptionJson.endpoint || '';
      const p256dh = subscriptionJson.keys?.p256dh || '';
      const auth = subscriptionJson.keys?.auth || '';

      // Save to database
      const response = await fetch(
        'https://YOUR_PROJECT_REF.supabase.co/functions/v1/register-push-subscription',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_ANON_KEY`
          },
          body: JSON.stringify({
            user_id: userId,
            user_type: userType,
            endpoint,
            p256dh,
            auth
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('[Push] Subscription error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, userId, userType]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      setIsLoading(true);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        if (userId && userType) {
          await fetch(
            'https://YOUR_PROJECT_REF.supabase.co/functions/v1/register-push-subscription',
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_ANON_KEY`
              },
              body: JSON.stringify({
                user_id: userId,
                user_type: userType
              })
            }
          );
        }
      }

      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('[Push] Unsubscribe error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, userId, userType]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe
  };
}
```

---

### Step 7: Create Helper Function

Create `src/lib/sendPushNotification.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';

interface SendPushParams {
  user_id: string;
  user_type: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendPushNotification(params: SendPushParams): Promise<boolean> {
  try {
    console.log('[sendPushNotification] Sending push:', {
      to: params.user_id,
      type: params.user_type,
      title: params.title
    });
    
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params
    });

    if (error) {
      console.error('[sendPushNotification] Error:', error);
      return false;
    }

    return data?.success ?? false;
  } catch (error) {
    console.error('[sendPushNotification] Exception:', error);
    return false;
  }
}
```

---

### Step 8: Integrate in Your App

#### 8.1 Add Subscribe Button

```tsx
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotificationSettings({ userId, userType }) {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications(userId, userType);

  if (!isSupported) {
    return <p>Push notifications are not supported in your browser.</p>;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <Button 
      onClick={handleToggle} 
      disabled={isLoading}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? (
        <>
          <BellOff className="w-4 h-4 mr-2" />
          Disable Notifications
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 mr-2" />
          Enable Notifications
        </>
      )}
    </Button>
  );
}
```

#### 8.2 Auto-Subscribe on Login (Optional)

```tsx
function useAutoSubscribe(userId, userType) {
  const { isSupported, permission, subscribe } = usePushNotifications(userId, userType);
  
  useEffect(() => {
    // Auto-subscribe if permission was previously granted
    if (isSupported && permission === 'granted' && userId) {
      subscribe();
    }
  }, [isSupported, permission, userId]);
}
```

---

## Sending Notifications

### From Frontend Code

```typescript
import { sendPushNotification } from '@/lib/sendPushNotification';

// Send notification to a specific user
await sendPushNotification({
  user_id: 'target-user-uuid',
  user_type: 'client',
  title: 'New Message',
  body: 'You have received a new message',
  url: '/messages/123',
  tag: 'message-123'  // Unique tag prevents duplicate notifications
});
```

### From Edge Functions

```typescript
// Inside another edge function
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

await supabase.functions.invoke('send-push-notification', {
  body: {
    user_id: 'target-user-uuid',
    user_type: 'client',
    title: 'Notification Title',
    body: 'Notification body text',
    url: '/path/to/open',
    tag: 'unique-tag'
  }
});
```

---

## Event-Triggered Notifications

### Database Webhook Trigger

You can set up Supabase database webhooks to trigger notifications on data changes:

1. Go to **Database** → **Webhooks** in Supabase Dashboard
2. Create a new webhook:
   - **Name**: `notify-on-new-message`
   - **Table**: `messages`
   - **Events**: `INSERT`
   - **URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-new-message`

Create the edge function:

```typescript
// supabase/functions/notify-new-message/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
}

serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  
  if (payload.type !== 'INSERT') return new Response('OK');
  
  const message = payload.record;
  
  // Get Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  // Send notification to recipient
  await supabase.functions.invoke('send-push-notification', {
    body: {
      user_id: message.recipient_id,
      user_type: 'client',
      title: 'New Message',
      body: message.content.substring(0, 100),
      url: `/messages/${message.id}`
    }
  });
  
  return new Response('OK');
});
```

### Scheduled (Cron) Notifications

For scheduled notifications, use pg_cron:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily reminder at 9 AM
SELECT cron.schedule(
  'daily-reminder',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-daily-reminder',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

---

## Best Practices

### 1. One Subscription Per User
Delete old subscriptions before inserting new ones to prevent duplicate notifications.

### 2. Handle Expired Subscriptions
Always check for 410/404 responses and clean up invalid subscriptions.

### 3. Use Unique Tags
Tags prevent duplicate notifications for the same event:
```typescript
tag: `issue-${issueId}-response`
```

### 4. Add Good Logging
Log all push operations for debugging:
```typescript
console.log('[send-push] Sending to:', user_id, 'Result:', response.status);
```

### 5. Smart Targeting
Only notify relevant users:
```typescript
// Don't notify the sender
if (message.sender_id !== recipient.id) {
  await sendPushNotification(...);
}
```

### 6. Use requireInteraction
For important notifications, set `requireInteraction: true` to prevent auto-dismiss.

### 7. Provide Actionable URLs
Always include a relevant URL that takes users to the related content:
```typescript
url: `/issues/${issueId}`
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "VAPID keys not configured" | Add secrets in Supabase Dashboard |
| Service worker not registering | Check file is in `/public` folder |
| Permission denied | User blocked notifications in browser settings |
| Notifications not showing | Check service worker logs in DevTools |
| 410/404 errors | Subscription expired, needs re-subscribe |

### Debugging Steps

1. **Check Edge Function Logs**:
   - Go to Supabase Dashboard → Edge Functions → Logs

2. **Check Service Worker**:
   - Open DevTools → Application → Service Workers
   - Check for errors in Console

3. **Verify Database**:
   ```sql
   SELECT * FROM push_subscriptions WHERE user_id = 'xxx';
   ```

4. **Test Manually**:
   ```bash
   curl -X POST \
     https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-push-notification \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"user_id":"xxx","user_type":"client","title":"Test","body":"Test message"}'
   ```

---

## Summary

This implementation provides:

- ✅ Secure VAPID-based authentication
- ✅ Service worker for background push handling
- ✅ React hook for easy subscription management
- ✅ Edge functions for subscription CRUD and sending
- ✅ Automatic cleanup of expired subscriptions
- ✅ Support for multiple user types
- ✅ Event-triggered and scheduled notifications

Replace placeholders (`YOUR_PROJECT_REF`, `YOUR_ANON_KEY`, icon paths, email addresses) with your actual values before deploying.
