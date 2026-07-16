# Skyline Mobile App - AI Handoff

## Project Overview

This is a React Native / Expo / TypeScript mobile app for Skyline Group.

The app is connected to the live Skyline website backend through a PHP/MySQL API.

Main API base URL:

https://skylinegroup-sy.com/api

The app no longer depends on Firebase for reading products and categories.

## Important Security Note

Do NOT expose or upload the real database connection file.

The real database credentials are on hosting, likely in:

/public_html/includes/db_connection.php

This file must never be committed to GitHub.

The folder `server-api-reference` contains only safe reference copies of the API files, not database credentials.

Do not upload:

- .env
- google-services.json
- db_connection.php
- any keystore file
- any password, token, secret, or private key

## Hosting API Files

The live API files are located on cPanel hosting:

/public_html/api/_bootstrap.php  
/public_html/api/health.php  
/public_html/api/products.php  
/public_html/api/product.php  
/public_html/api/categories.php  

Backup copies also exist on hosting:

/public_html/api/products-old.php  
/public_html/api/product-old.php  
/public_html/api/categories-old.php  

## Local Reference API Files

Safe copies for AI/development reference are stored in:

server-api-reference/_bootstrap.php  
server-api-reference/health.php  
server-api-reference/products.php  
server-api-reference/product.php  
server-api-reference/categories.php  

These are reference copies only.

Editing files inside `server-api-reference` in GitHub does not change the live hosting API.

The real active API is on cPanel inside:

/public_html/api

## Current API Endpoints

Health check:

https://skylinegroup-sy.com/api/health.php

Products:

https://skylinegroup-sy.com/api/products.php?limit=500

Categories:

https://skylinegroup-sy.com/api/categories.php

Single product example:

https://skylinegroup-sy.com/api/product.php?id=catalog-4

## API Data Sources

The API merges sale products from two database tables:

- products
- store_catalog

The mobile app displays products from both tables.

The `store_catalog` products use IDs like:

catalog-4  
catalog-10  

Normal `products` table items use numeric IDs.

## Current Mobile App Features

The app currently supports:

- Arabic and Turkish only
- English removed from the visible UI
- Product list
- Category list and filtering
- Product details page
- Product images
- Product prices
- Related products
- Add to cart
- Cart page
- Checkout flow
- Language switching between Arabic and Turkish
- Android APK built with EAS Build preview profile
- APK was downloaded and installed successfully on a phone

## Important App Files

API client:

services/apiClient.ts

Product mapping and API product logic:

services/productService.ts

Category mapping and category API logic:

services/categoryService.ts

Product card UI:

components/ProductCard.tsx

Products screen:

app/(tabs)/products.tsx

Product details screen:

app/product/[id].tsx

Language context:

context/LanguageContext.tsx

Translations:

constants/translations.ts

Cart context:

context/CartContext.tsx

EAS build configuration:

eas.json

## Language Notes

The app UI uses only:

- Arabic
- Turkish

English was removed from the visible UI.

Some internal TypeScript product objects may still contain `en` fields because existing types require multilingual objects with ar/tr/en.

The app UI should not show English to the user.

Turkish fallback logic was added to avoid showing Arabic text inside Turkish fields when Turkish data is missing.

## Category Notes

Special category IDs:

machine => Arabic: الماكينات / Turkish: Makineler  
raw_material => Arabic: المواد الخام / Turkish: Ham Maddeler  

These IDs must stay unchanged internally because filtering depends on them.

Only the display labels should be translated.

## Current GitHub Status

The mobile app code is committed and pushed to GitHub.

The current branch is:

main

The local branch was previously confirmed up to date with:

origin/main

Current new files being added for handoff:

- AI_HANDOFF.md
- eas.json
- server-api-reference/
- updated .gitignore

## Current Build Status

The app was built as an Android APK using EAS Build:

eas build -p android --profile preview

The APK was downloaded and installed successfully on a phone.

## Future Development Ideas

Possible next tasks:

1. Add product customization like the website.
2. Add design file upload from the mobile app.
3. Add extra order notes.
4. Add option: "I do not have a design".
5. Add design service fee.
6. Create an orders API endpoint.
7. Save checkout orders to the website database.
8. Show mobile orders in the website admin panel.
9. Improve cart and checkout UI.
10. Add push notifications.
11. Polish app icon and splash screen.
12. Prepare production build.
13. Prepare Google Play Store release.

## Important Development Rule

Do not directly edit the live cPanel files unless the user explicitly asks.

For backend changes:

1. Edit local/reference code first.
2. Explain exactly which live hosting file must be changed.
3. Backup the old hosting file first.
4. Then update cPanel carefully.

## Useful Commands

Run app locally:

npx expo start --clear

Build Android APK:

eas build -p android --profile preview

Check Git status:

git status -sb

Check tracked sensitive files:

git ls-files .env google-services.json

Commit changes safely:

git add .gitignore AI_HANDOFF.md eas.json server-api-reference
git commit -m "Add safe API reference and AI handoff"
git push