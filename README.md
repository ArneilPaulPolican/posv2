# Install the Ionic CLI
Before proceeding, make sure your computer has Node.js installed. See these instructions to set up an environment for Ionic.

Install the Ionic CLI with npm:
```bash
$ npm install -g @ionic/cli
```
If there was a previous installation of the Ionic CLI, it will need to be uninstalled due to a change in package name.

```bash
$ npm uninstall -g ionic
$ npm install -g @ionic/cli
```

# Start the app
Create an Ionic app using one of the pre-made app templates, or a blank one to start fresh. The three most common starters are the blank starter, tabs starter, and sidemenu starter. Get started with the ionic start command:
```bash
$ ionic serve
```

# Running on Devices
iOS: 
```bash
$ ionic cap copy
$ ionic cap sync
$ ionic capacitor run ios
$ ionic cap open ios
```

Android:
```bash
$ ionic cap copy
$ ionic cap sync
$ ionic capacitor run android
$ ionic cap open android
```
# Reference

https://ionicframework.com/docs/vue/your-first-app/deploying-mobile
