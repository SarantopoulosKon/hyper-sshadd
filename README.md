# hyper-sshadd

A hyper plugin used to automatically add ssh passphrase.

## install

```
npm install -g hyper-sshadd

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