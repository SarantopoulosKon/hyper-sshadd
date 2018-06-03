# hyper-sshadd

Extension for hyper.app terminal in order to automatically load ssh-key. Inspired by [hyper-startup](https://github.com/curz46/hyper-startup)

## install

```
hyper i hyper-sshadd

```

## setup

In your `.hyper.js` add your ssh passphrase
```
module.exports = {
  config: {
  	...
    sshPassphrase: 'your ssh Passphrase',
  },
  ...
};

```
