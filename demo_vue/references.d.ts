/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "*.scss";

declare const TNS_ENV;
