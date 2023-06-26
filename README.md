# BLOC - Line bisection pc task

**DISCLAIMER: This app is currenty undergoing empirical validation, use at your own discretion for clinical purposes.**

## How to use

Instructions to come

## Changelog

v1.0.0 - Inital release version

## Testing

`npm run test`

## Building

`npm run build`

## Packaging

`npm run package`

For macOS signing and notarization:

- there are two possiblities:
  - Using an app specific password, your dev id and team id
  - using the keychain
    - add your Apple Developper credentials to the keychain: `xcrun notarytool store-credentials --apple-id "XXXX" --team-id "XXXXX"`
    - enter a name when asked, this will be your KEYCHAIN_PROFILE variable
- create a .env file, examples are given below

Password example

```
APPLE_ID=<APPLEID>
APPLE_APP_SPECIFIC_PASSWORD=<APP SPECIFIC PASSWORD>
TEAM_ID=<APPLLE DEV TEAM ID>
CI=true
```

Keychain example

```
CI=true
KEYCHAIN_PROFILE=<KEYCHAIN NAME GIVEN IN THE PREVIOUS STEP>
```

## Contributing
