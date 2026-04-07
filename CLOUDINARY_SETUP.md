# Cloudinary Setup Guide for Civic Voice

## Overview
Image uploads require Cloudinary to be configured. Without these credentials, the image upload feature will fail with a 503 error.

## Steps to Set Up Cloudinary

### 1. Create a Cloudinary Account
- Go to [Cloudinary](https://cloudinary.com/users/register/free)
- Sign up for a free account
- Verify your email

### 2. Get Your Credentials
- Log in to your Cloudinary Dashboard
- Navigate to **Settings** → **API Keys**
- You'll see three values:
  - **Cloud Name** (usually at the top)
  - **API Key**
  - **API Secret**

### 3. Add to Render Environment Variables

#### Option A: Using Render Dashboard (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your **civic-voice-api** service
3. Click **Environment** in the sidebar
4. Add three new environment variables:
   - `CLOUDINARY_CLOUD_NAME`: Your Cloud Name
   - `CLOUDINARY_API_KEY`: Your API Key
   - `CLOUDINARY_API_SECRET`: Your API Secret
5. Click **Deploy** to redeploy with new environment variables

#### Option B: Using render.yaml
The `render.yaml` file already includes these variables. Add your credentials:

```yaml
envVars:
  - key: CLOUDINARY_CLOUD_NAME
    value: "your-cloud-name"
  - key: CLOUDINARY_API_KEY
    value: "your-api-key"
  - key: CLOUDINARY_API_SECRET
    value: "your-api-secret"
```

⚠️ **Important**: Don't commit secrets to GitHub. Use Render's environment variable system instead.

### 4. Test the Upload

1. Redeploy the service on Render (or push to trigger auto-deploy)
2. Try uploading a proof image in the Admin panel
3. Verify the image displays correctly

## Verification

You'll know it's working when:
- ✅ Image upload completes without 503 error
- ✅ Admin receives success response with image URL
- ✅ Images display correctly in resolved issues list
- ✅ Server logs show Cloudinary upload success (no `ENOENT` errors)

## Troubleshooting

### Upload returns 503 error
**Cause**: Cloudinary credentials not configured
**Fix**: Add `CLOUDINARY_CLOUD_NAME` to environment variables

### Upload succeeds but image shows 404
**Cause**: Image URL is wrong or Cloudinary API credentials are invalid
**Fix**: Check API Key and API Secret are correct

### Images not persisting
**Older behavior**: Falls back to local file storage which fails in Docker
**New behavior**: Requires Cloudinary to be configured
**Fix**: Complete steps above to set up Cloudinary

## Cloudinary Free Tier Limits
- 25 GB total storage
- 1 GB monthly uploads
- Sufficient for civic engagement platform with moderate usage

## Security Notes
- ✅ API Secret should never be committed to code
- ✅ Render's environment variables are encrypted at rest
- ✅ Use Render dashboard or `render.yaml` (not Git) to set secrets
