# Google Analytics 4 Setup Guide (GA4)

This website is pre-wired to inject Google Analytics tracking tags into production builds. Follow these steps to create your GA4 account and find the measurement ID.

---

## 1. Create a GA4 Account & Property
1. Visit [Google Analytics](https://analytics.google.com) and log in with your Google Account.
2. Click on the **Admin** gear icon in the bottom-left corner of the sidebar.
3. In the **Account** column, click **Create Account**. Enter your account details (e.g. `Joyce J Charuvila & Associates`).
4. Under the **Property** column, click **Create Property**:
   - **Property Name**: `CA Firm Website`
   - **Reporting Time Zone**: Select `India` (or your target timezone).
   - **Currency**: Select `Indian Rupee (INR)` or `United Arab Emirates Dirham (AED)`.
5. Select your business size and objectives, then click **Create**.

---

## 2. Set Up Web Data Stream
1. Once the property is created, click on **Data Streams** under the Property settings column.
2. Select **Web** as the platform.
3. Enter your stream details:
   - **Website URL**: `joyceca.in`
   - **Stream Name**: `Production Website`
4. Leave **Enhanced Measurement** enabled (measures pageviews, scrolls, clicks, etc.) and click **Create Stream**.

---

## 3. Retrieve the GA4 Measurement ID
1. In the Web Stream Details page that loads after creation, look for the **Measurement ID** in the top right corner.
2. The Measurement ID starts with `G-` followed by a sequence of characters (e.g., `G-1A2BC3DE4F`).
3. Copy this Measurement ID.

---

## 4. Map the Environment Variables
1. Add this key to your local `.env.local` file for testing:
   ```env
   # Google Analytics 4 Measurement ID
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
2. Navigate to your project on **Vercel** → **Settings** → **Environment Variables** and add:
   - Key: `NEXT_PUBLIC_GA_ID`
   - Value: *[Your GA4 Measurement ID starting with G-]*
3. Trigger a redeployment or push changes to Vercel so that the GA4 scripts inject into the production build.
