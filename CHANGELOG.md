# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.13](https://github.com/nativescript-community/gesturehandler/compare/v2.0.12...v2.0.13) (2023-10-12)


### Bug Fixes

* **android:** recycle MotionEvent when necessary ([d61e704](https://github.com/nativescript-community/gesturehandler/commit/d61e704c60f43c1daca00a362ed6584517958595))
* **android:** support new optimized GridLayout (not yet released) ([8c03991](https://github.com/nativescript-community/gesturehandler/commit/8c03991bbee26e160c8328aabcf7f0afd099c2f8))
* ensure we release all callbacks (N gesture override) ([dcd430a](https://github.com/nativescript-community/gesturehandler/commit/dcd430a5bc1e061a879e159eceb75ce121b17d66))





## [2.0.12](https://github.com/nativescript-community/gesturehandler/compare/v2.0.11...v2.0.12) (2023-06-27)


### Bug Fixes

* **android:** broken build ([0a42307](https://github.com/nativescript-community/gesturehandler/commit/0a423078a415d113222fa745b3666cd64d58b0ce))





## [2.0.11](https://github.com/nativescript-community/gesturehandler/compare/v2.0.10...v2.0.11) (2023-06-27)


### Bug Fixes

* **android:** fix for latest N and getting application context ([d1fa49f](https://github.com/nativescript-community/gesturehandler/commit/d1fa49f7fbd23d312f3ae2e55d9b145ac7cf9ca2))





## [2.0.10](https://github.com/nativescript-community/gesturehandler/compare/v2.0.9...v2.0.10) (2023-04-28)


### Bug Fixes

* **android:** prevent gesture activation when outside the visible rect of a view ([5426539](https://github.com/nativescript-community/gesturehandler/commit/54265393d4f626ebac34c0eacbcbe56ed71a3bdb))





## [2.0.9](https://github.com/nativescript-community/gesturehandler/compare/v2.0.8...v2.0.9) (2023-03-08)


### Bug Fixes

* GestureRootView layout fix ([611b4e2](https://github.com/nativescript-community/gesturehandler/commit/611b4e210d9b40044026fd7981d2ca4d2a72e1a3))





## [2.0.8](https://github.com/nativescript-community/gesturehandler/compare/v2.0.7...v2.0.8) (2022-12-16)


### Bug Fixes

* N 8.4 final fix ([19b554d](https://github.com/nativescript-community/gesturehandler/commit/19b554d004967b23068eb558e5dd042813b23bca))





## [2.0.7](https://github.com/nativescript-community/gesturehandler/compare/v2.0.6...v2.0.7) (2022-12-01)

**Note:** Version bump only for package nativescript-gesturehandler





## [2.0.6](https://github.com/nativescript-community/gesturehandler/compare/v2.0.5...v2.0.6) (2022-11-04)

### Bug Fixes

-   **android:** touch override not working ([fa79215](https://github.com/nativescript-community/gesturehandler/commit/fa792155104da396d2663643d19118633c0a8586))

## [2.0.5](https://github.com/nativescript-community/gesturehandler/compare/v2.0.4...v2.0.5) (2022-05-03)

### Features

-   **android:** disallowInterceptTouch ([d71c630](https://github.com/nativescript-community/gesturehandler/commit/d71c63029cf4d9c01b4872bb93ce4433a9b9aecc))

## [2.0.4](https://github.com/nativescript-community/gesturehandler/compare/v2.0.3...v2.0.4) (2022-05-03)

### Bug Fixes

-   **android:** build fix with pnpm ([90b3a95](https://github.com/nativescript-community/gesturehandler/commit/90b3a953c8cf5f6ec2d488814c1e9d752591de3a))

## [2.0.3](https://github.com/nativescript-community/gesturehandler/compare/v2.0.2...v2.0.3) (2022-04-11)

### Bug Fixes

-   **android:** gesture not being detached correctly ([8dca885](https://github.com/nativescript-community/gesturehandler/commit/8dca88585023738f0e3a1e001af5b80cd27794a6))
-   N gesture override fixes and faster load/unload ([4209244](https://github.com/nativescript-community/gesturehandler/commit/42092441dcac6df41944e841e87dc7c3dff74f55))

## [2.0.2](https://github.com/nativescript-community/gesturehandler/compare/v2.0.1...v2.0.2) (2022-04-09)

### Bug Fixes

-   override fix for most gestures ([bcd9bae](https://github.com/nativescript-community/gesturehandler/commit/bcd9bae045280a4eb19489e6371c20b67084569d))

## [2.0.1](https://github.com/nativescript-community/gesturehandler/compare/v0.2.2...v2.0.1) (2022-03-31)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.2.2](https://github.com/nativescript-community/gesturehandler/compare/v0.2.1...v0.2.2) (2022-03-31)

### Bug Fixes

-   **android:** longpress not always recognized ([0ce2ce6](https://github.com/nativescript-community/gesturehandler/commit/0ce2ce681debb8f915467907c54fa9ec55a88f35))

## [0.2.1](https://github.com/nativescript-community/gesturehandler/compare/v0.2.0...v0.2.1) (2022-03-28)

### Bug Fixes

-   detach fix ([440ca63](https://github.com/nativescript-community/gesturehandler/commit/440ca633dee2b5efbf9f0f26062b5bf0f348354d))

# [0.2.0](https://github.com/nativescript-community/gesturehandler/compare/v0.1.53...v0.2.0) (2022-03-28)

### Features

-   added `GestureRootView` to allow the plugin to work ([4167112](https://github.com/nativescript-community/gesturehandler/commit/4167112b698cf67bda568bce55cf647600ed5b78))

## [0.1.53](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.52...v0.1.53) (2022-03-25)

### Bug Fixes

-   **android:** override N gesture working with button ([a5fc49c](https://github.com/Akylas/nativescript-gesturehandler/commit/a5fc49ca85e289991caeac028f70aaaf27d48b7a))

## [0.1.52](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.51...v0.1.52) (2022-02-17)

### Bug Fixes

-   **android:** buid fix in some cases ([a1b75ca](https://github.com/Akylas/nativescript-gesturehandler/commit/a1b75ca008ef13d8a33009c3f8b271bb7f5f70e4))

## [0.1.51](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.50...v0.1.51) (2022-02-17)

### Bug Fixes

-   allow plugin to work with @akylas/nativescript fork ([aad3276](https://github.com/Akylas/nativescript-gesturehandler/commit/aad3276d5abe54e79f9b955672007e2c67cb43fb))

## [0.1.50](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.49...v0.1.50) (2022-01-04)

### Bug Fixes

-   **ios:** build fix ([ce1a71e](https://github.com/Akylas/nativescript-gesturehandler/commit/ce1a71e8b323e97394a468b2d7d6194495757169))

## [0.1.49](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.48...v0.1.49) (2022-01-04)

### Bug Fixes

-   **ios:** ensure `setEnabled` is available through JS for GestureHandler ([56ec946](https://github.com/Akylas/nativescript-gesturehandler/commit/56ec94674699383160ff86ddf43a1edbe43bd506))

## [0.1.48](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.47...v0.1.48) (2021-10-11)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.47](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.46...v0.1.47) (2021-09-22)

### Bug Fixes

-   **android:** fix after break in last version ([5d5ceb9](https://github.com/Akylas/nativescript-gesturehandler/commit/5d5ceb9112a0b731e9779cd9b892da13ec4099a6))

## [0.1.46](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.45...v0.1.46) (2021-09-22)

### Bug Fixes

-   **android:** gradle 7.0 fix ([9b7de7f](https://github.com/Akylas/nativescript-gesturehandler/commit/9b7de7ff377566a62efb3b5b0604c4669c66223e))

## [0.1.45](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.44...v0.1.45) (2021-06-04)

### Bug Fixes

-   **android:** NPE fix ([4c57840](https://github.com/Akylas/nativescript-gesturehandler/commit/4c5784055974284849eb12749d59830ee22e1ee0))

## [0.1.44](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.43...v0.1.44) (2021-05-17)

### Bug Fixes

-   **android:** prevent crash ([65ce28a](https://github.com/Akylas/nativescript-gesturehandler/commit/65ce28adbac2657dbd204e932757cc78db103874))

## [0.1.43](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.42...v0.1.43) (2021-05-12)

### Bug Fixes

-   **android:** allow touch through on non clickable view ([ee0bd9e](https://github.com/Akylas/nativescript-gesturehandler/commit/ee0bd9e444ec1840e77d615111261ad174359de9))
-   override rewrite to get closer to N ([5d03a7d](https://github.com/Akylas/nativescript-gesturehandler/commit/5d03a7dfd753f346465adc0a9c8b686b372822a1))
-   positions in dpi ([b8d6a3d](https://github.com/Akylas/nativescript-gesturehandler/commit/b8d6a3da6676c09f137bca697837e11d0a2b51b5))

## [0.1.42](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.41...v0.1.42) (2021-04-22)

### Bug Fixes

-   nativeGetterKey option for handler ([9bf46bf](https://github.com/Akylas/nativescript-gesturehandler/commit/9bf46bf6aa3086f7e4f23d8e9eb6fe33d5e22b57))

## [0.1.41](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.40...v0.1.41) (2021-03-26)

### Bug Fixes

-   broken rlease! ([0a60ce3](https://github.com/Akylas/nativescript-gesturehandler/commit/0a60ce36fa0b2b39baad5a7621043b9eecaf0bda))

## [0.1.40](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.39...v0.1.40) (2021-03-26)

### Bug Fixes

-   exclusiveTouch css prop ([22df7cf](https://github.com/Akylas/nativescript-gesturehandler/commit/22df7cf838ba6acdc96db2400460f54508e114f4))

## [0.1.39](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.38...v0.1.39) (2021-03-17)

### Bug Fixes

-   log removal ([86e4968](https://github.com/Akylas/nativescript-gesturehandler/commit/86e4968438a2c6272f8b2224ffe5647177c67615))

## [0.1.38](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.37...v0.1.38) (2021-03-16)

### Bug Fixes

-   removed logs ([f9c9808](https://github.com/Akylas/nativescript-gesturehandler/commit/f9c98082128cfd6414dc6be1baa10ef293e66f6f))

## [0.1.37](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.36...v0.1.37) (2021-03-14)

### Bug Fixes

-   a lot of gesture overrides fixes ([c0976e2](https://github.com/Akylas/nativescript-gesturehandler/commit/c0976e2323733b5b723da330fe81b110517d72d8))
-   exclusive touch fix ([7cfe2d6](https://github.com/Akylas/nativescript-gesturehandler/commit/7cfe2d6042f22f1447e3a2d30a3632f83763a72f))
-   **ios:** override support for touch gesture ([64bd989](https://github.com/Akylas/nativescript-gesturehandler/commit/64bd989da67520f1a9ced397aae6308cef7df85c))

## [0.1.36](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.35...v0.1.36) (2020-12-20)

### Features

-   exclusiveTouch property ([94f6599](https://github.com/Akylas/nativescript-gesturehandler/commit/94f6599e47f041b3055f24ec810d744316f905f9))

## [0.1.35](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.34...v0.1.35) (2020-11-29)

### Bug Fixes

-   android ensure we cancel events correctly ([30ffce3](https://github.com/Akylas/nativescript-gesturehandler/commit/30ffce318b0c4221501b1d6e23c219fc4a8ab356))

## [0.1.34](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.33...v0.1.34) (2020-11-23)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.33](https://github.com/nativescript-community/gesturehandler/compare/v0.1.32...v0.1.33) (2020-11-22)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.32](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.31...v0.1.32) (2020-11-20)

### Bug Fixes

-   android bug fix when touch event could be dispatched after view destroyed ([36161cc](https://github.com/Akylas/nativescript-gesturehandler/commit/36161cc83762cec679fcaecb5dc8f147064abcd6))

## [0.1.31](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.30...v0.1.31) (2020-11-19)

### Bug Fixes

-   ios fix for gesture not activating ([f954c15](https://github.com/Akylas/nativescript-gesturehandler/commit/f954c15db50c660b3607242b5b54da389bf7ef08))

## [0.1.30](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.29...v0.1.30) (2020-11-17)

### Bug Fixes

-   cleanup logs ([dbeca1d](https://github.com/Akylas/nativescript-gesturehandler/commit/dbeca1d5b7f663969469cd842aaaafd77d9773ef))

## [0.1.29](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.28...v0.1.29) (2020-11-15)

### Bug Fixes

-   android fixes for native gestures ([c6321bb](https://github.com/Akylas/nativescript-gesturehandler/commit/c6321bb9ac0af4fe68636118cb334d548d4eafc6))
-   direction is now a number allowing masks ([7324cd9](https://github.com/Akylas/nativescript-gesturehandler/commit/7324cd90e984ef783f77db979134a281b24e68a2))

## [0.1.28](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.27...v0.1.28) (2020-11-11)

### Bug Fixes

-   prevent unwanted and impossible touches on simulator ([8982fd1](https://github.com/Akylas/nativescript-gesturehandler/commit/8982fd1fecd62cecefe2e9adb0fb26ddcf655b0d))

## [0.1.27](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.26...v0.1.27) (2020-11-06)

### Bug Fixes

-   new option shouldStartGesture ([f895fbb](https://github.com/Akylas/nativescript-gesturehandler/commit/f895fbb3049979de681dbeeb32a863d1482e5ecc))

## [0.1.26](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.25...v0.1.26) (2020-10-21)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.25](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.24...v0.1.25) (2020-10-20)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.24](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.23...v0.1.24) (2020-10-20)

### Bug Fixes

-   a few fixes ([ca5b220](https://github.com/Akylas/nativescript-gesturehandler/commit/ca5b220f9daa6c785e4c7507c6663df44664c854))
-   some fixes to prevent multiple attach ([5bcdb57](https://github.com/Akylas/nativescript-gesturehandler/commit/5bcdb57de1fad78fb6b1fe817ecc842137ac2b01))

## [0.1.23](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.22...v0.1.23) (2020-10-16)

### Bug Fixes

-   android fix taken from rn ([e8145e6](https://github.com/Akylas/nativescript-gesturehandler/commit/e8145e6339765679135ac22b6068977058a34fa8))
-   android nativeviewgesture dispatch cancel ([d5bb774](https://github.com/Akylas/nativescript-gesturehandler/commit/d5bb774f22beec6460e02cc1e87ff7e128080828))
-   Demo app commands not working. ([9e3701b](https://github.com/Akylas/nativescript-gesturehandler/commit/9e3701ba395d843a8e3b0e817fa9ef3b37a0fe52))
-   github stats not being visualized ([cb00f9c](https://github.com/Akylas/nativescript-gesturehandler/commit/cb00f9cfe4760171f28da409d3f062ae61796d1a))
-   multiple fixes for the overrides ([1be0719](https://github.com/Akylas/nativescript-gesturehandler/commit/1be0719e1f114451f87f123ad398108bdf7ace20))

## [0.1.22](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.21...v0.1.22) (2020-09-09)

### Bug Fixes

-   dont bundle aar ([08e0b22](https://github.com/Akylas/nativescript-gesturehandler/commit/08e0b2207d95128326bc36cc7b7ed523dd811dd3))

## [0.1.21](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.20...v0.1.21) (2020-09-09)

### Bug Fixes

-   **ios:** another fix ([e014a1b](https://github.com/Akylas/nativescript-gesturehandler/commit/e014a1b0abc4e764c32f225742d1fd7458fa6e35))
-   **ios:** plugin not building ([153403f](https://github.com/Akylas/nativescript-gesturehandler/commit/153403f77c1f23b5105c3e17f9d9bcbffb32b005))

## [0.1.20](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.19...v0.1.20) (2020-09-08)

### Bug Fixes

-   dont package native compiled ([f306c47](https://github.com/Akylas/nativescript-gesturehandler/commit/f306c476391ad6a0aa18530c97f520ea721f8626))

## [0.1.19](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.18...v0.1.19) (2020-09-06)

### Bug Fixes

-   **android:** plugin not compiling ([d84b471](https://github.com/Akylas/nativescript-gesturehandler/commit/d84b471fdfd9901864242bda4c8f08147188b76b))

## [0.1.18](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.17...v0.1.18) (2020-09-06)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.17](https://github.com/Akylas/nativescript-gesturehandler/compare/v0.1.16...v0.1.17) (2020-09-05)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.16](https://github.com/nativescript-community/gesturehandler/compare/v0.1.15...v0.1.16) (2020-05-28)

### Bug Fixes

-   esm fix ([ef2fe97](https://github.com/nativescript-community/gesturehandler/commit/ef2fe97714162a361c749f871c1ec1b768a40aec))

## [0.1.15](https://github.com/nativescript-community/gesturehandler/compare/v0.1.14...v0.1.15) (2020-05-21)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.14](https://github.com/nativescript-community/gesturehandler/compare/v0.1.13...v0.1.14) (2020-05-21)

### Bug Fixes

-   sideEffects for tree shacking ([6c69498](https://github.com/nativescript-community/gesturehandler/commit/6c6949809142f75429ff1745b1a2298b21d85ad6))

## [0.1.13](https://github.com/nativescript-community/gesturehandler/compare/v0.1.12...v0.1.13) (2020-05-21)

### Bug Fixes

-   esm using import for tree shaking ([3d69b26](https://github.com/nativescript-community/gesturehandler/commit/3d69b2691cb2744de0f485498d9e22622226d233))

## [0.1.12](https://github.com/nativescript-community/gesturehandler/compare/v0.1.11...v0.1.12) (2020-05-21)

### Bug Fixes

-   full esm support ([ee732cf](https://github.com/nativescript-community/gesturehandler/commit/ee732cf3c568045059fe10e5593c0f732a2a40b1))

## [0.1.11](https://github.com/nativescript-community/gesturehandler/compare/v0.1.10...v0.1.11) (2020-05-12)

### Bug Fixes

-   some override fixes ([df4defc](https://github.com/nativescript-community/gesturehandler/commit/df4defc435000f87a6467c6a1e5ad0c8f44a6455))

## [0.1.10](https://github.com/nativescript-community/gesturehandler/compare/v0.1.9...v0.1.10) (2020-05-12)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.9](https://github.com/nativescript-community/gesturehandler/compare/v0.1.8...v0.1.9) (2020-05-12)

### Bug Fixes

-   multi direction fling support ([4eec691](https://github.com/nativescript-community/gesturehandler/commit/4eec6915a90be8dc1e86199c3b979f7b6c81dbc7))

## [0.1.8](https://github.com/nativescript-community/gesturehandler/compare/v0.1.7...v0.1.8) (2020-04-28)

### Bug Fixes

-   **android:** native extension ([d63348a](https://github.com/nativescript-community/gesturehandler/commit/d63348ae40a19bc9ff6d1213302d0b975f2897b7))

## [0.1.7](https://github.com/nativescript-community/gesturehandler/compare/v0.1.6...v0.1.7) (2020-03-20)

### Bug Fixes

-   **ios:** build fix ([b3b3061](https://github.com/nativescript-community/gesturehandler/commit/b3b3061001e94b75aeafbafad5042a4897b5ba48))

## [0.1.6](https://github.com/nativescript-community/gesturehandler/compare/v0.1.5...v0.1.6) (2020-01-17)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.1.5](https://github.com/nativescript-community/gesturehandler/compare/v0.1.4...v0.1.5) (2020-01-17)

### Bug Fixes

-   wrong positions return on ios ([b63ec94](https://github.com/nativescript-community/gesturehandler/commit/b63ec94eabca89b756cb3c2f9f46f1e85dbe944c))

## [0.1.4](https://github.com/nativescript-community/gesturehandler/compare/v0.1.3...v0.1.4) (2020-01-13)

### Bug Fixes

-   fix import for ios ([47b8f24](https://github.com/nativescript-community/gesturehandler/commit/47b8f24278322f426ce72dff5e27d0d77656de1d))

## [0.1.3](https://github.com/nativescript-community/gesturehandler/compare/v0.1.2...v0.1.3) (2020-01-13)

### Bug Fixes

-   taphandler with doubletaphandler ([6c3ed76](https://github.com/nativescript-community/gesturehandler/commit/6c3ed76e958660ea83364f1e3e9e6fcef8e7a43b))

## [0.1.2](https://github.com/nativescript-community/gesturehandler/compare/v0.1.1...v0.1.2) (2020-01-11)

### Bug Fixes

-   doc fixed ([f6ecc31](https://github.com/nativescript-community/gesturehandler/commit/f6ecc31df0fe39b9e96fa8a39f973e95e8f5a5ce))
-   some fixes ([18b8295](https://github.com/nativescript-community/gesturehandler/commit/18b8295f73cf582cbc10933db9be96bf582d340d))

## [0.1.1](https://github.com/nativescript-community/gesturehandler/compare/v0.1.0...v0.1.1) (2020-01-07)

### Bug Fixes

-   custom ScaleGestureDetector to control minSpan ([1b7c739](https://github.com/nativescript-community/gesturehandler/commit/1b7c739dd681b4d1c131b0c142549ecf3d94db9e))
-   remove logs ([6c43171](https://github.com/nativescript-community/gesturehandler/commit/6c431715c034c4973f431842dba71e930714ccfd))

### Features

-   report all pointers locations for ios ([e5d42d1](https://github.com/nativescript-community/gesturehandler/commit/e5d42d13486c79dd3f487cb16a6f01a41b2a2053))
-   report all touch positions ([f147149](https://github.com/nativescript-community/gesturehandler/commit/f1471490bdf163f21c76bd5858dc93d53fc52805))

# [0.1.0](https://github.com/nativescript-community/gesturehandler/compare/v0.0.11...v0.1.0) (2020-01-01)

### Features

-   use @nativescript-community/observable ([a62eb62](https://github.com/nativescript-community/gesturehandler/commit/a62eb62ef42f928cdf768e8f96a765010daf7db3))

## [0.0.11](https://github.com/nativescript-community/gesturehandler/compare/v0.0.10...v0.0.11) (2019-12-29)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.10](https://github.com/nativescript-community/gesturehandler/compare/v0.0.9...v0.0.10) (2019-12-29)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.9](https://github.com/nativescript-community/gesturehandler/compare/v0.0.8...v0.0.9) (2019-12-29)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.8](https://github.com/nativescript-community/gesturehandler/compare/v0.0.7...v0.0.8) (2019-08-11)

### Bug Fixes

-   signature ([6ed89bf](https://github.com/nativescript-community/gesturehandler/commit/6ed89bf))
-   throw error is view has no parent page ([e7f67a4](https://github.com/nativescript-community/gesturehandler/commit/e7f67a4))

## [0.0.7](https://github.com/nativescript-community/gesturehandler/compare/v0.0.6...v0.0.7) (2019-07-24)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.6](https://github.com/nativescript-community/gesturehandler/compare/v0.0.5...v0.0.6) (2019-07-19)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.5](https://github.com/nativescript-community/gesturehandler/compare/v0.0.4...v0.0.5) (2019-07-09)

### Bug Fixes

-   remove wrong dependencies ([26946c2](https://github.com/nativescript-community/gesturehandler/commit/26946c2))

## [0.0.4](https://github.com/nativescript-community/gesturehandler/compare/v0.0.3...v0.0.4) (2019-06-12)

### Bug Fixes

-   android one registry per page ([f57fccf](https://github.com/nativescript-community/gesturehandler/commit/f57fccf))
-   check for null ([0f0d83d](https://github.com/nativescript-community/gesturehandler/commit/0f0d83d))

## [0.0.3](https://github.com/nativescript-community/gesturehandler/compare/v0.0.2...v0.0.3) (2019-06-12)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## [0.0.2](https://github.com/nativescript-community/gesturehandler/compare/v0.0.1...v0.0.2) (2019-06-12)

**Note:** Version bump only for package @nativescript-community/gesturehandler

## 0.0.1 (2019-06-11)

**Note:** Version bump only for package @nativescript-community/gesturehandler
