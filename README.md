# BLOC - Line bisection pc task

**DISCLAIMER: This app is currenty undergoing empirical validation, use at your own discretion for clinical purposes.**

## Download

All downloads are hosted on the [release page](https://github.com/JackGlobetrotter/bloc/releases/latest).

### Windows

- [BLOC.exe](https://github.com/JackGlobetrotter/bloc/releases/latest/download/BLOC.exe)
- Only x64 OS versions are supported
- A waring may pop up during download, as the sodtware is not signed with a Windows authorized certificat due to cost reasons.
- When firsyt opening the application you will see a message popup due to this software not beeing verified:
  ![Windows Warning Message](https://github.com/JackGlobetrotter/bloc/blob/main/docs/windowsUnverifiedMessage.png?raw=true)
- Click on `More info` and `Run anyway`

### MacOS

- Intel : [BLOC-x64.dmg](https://github.com/JackGlobetrotter/bloc/releases/latest/download/BLOC-x64.dmg)
- Apple silicon (M1, M2, ...): [BLOC-arm64.dmg](https://github.com/JackGlobetrotter/bloc/releases/latest/download/BLOC-arm64.dmg)

### Linux

- Instructions to come

## How to use

-

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
