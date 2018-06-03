let commands = [];

/**
 * [Polling function {@link https://davidwalsh.name/javascript-polling|Learn More}]
 * @param  {Function} fn             [description]
 * @param  {[type]}   timeout        [description]
 * @param  {Number}   [interval=100] [description]
 * @return {[type]}                  [description]
 */
const poll = (fn, timeout, interval = 100) => {
    const endTime = Number(new Date()) + (timeout || 2000);

    const checkCondition = (resolve, reject) => {
    // If the condition is met, we're done!
        const result = fn();
        if (result) {
            resolve(result);
            // If the condition isn't met but the timeout hasn't elapsed, go again
        } else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
            // Didn't match and too much time, reject!
        } else {
            reject(new Error(`timed out for ${fn}:${arguments}`));
        }
    };

    return new Promise(checkCondition);
};

module.exports.onApp = app => {
    const {sshPassphrase} = app.config.getConfig();

    if (!sshPassphrase) {
        return;
    }
    commands = [
        'eval $(ssh-agent)',
        'echo "exec cat" > ap-cat.sh',
        'chmod a+x ap-cat.sh',
        'export DISPLAY=1',
        `echo ${sshPassphrase} | SSH_ASKPASS=./ap-cat.sh ssh-add ~/.ssh/id_rsa`,
        'rm ap-cat.sh'
    ];
};

module.exports.onWindow = win => {
    win.rpc.on('add-ssh', uid => {
        commands.forEach(cmd => {
            win.sessions.get(uid).write(`${cmd}\r`);
        });
    });
};

const waitForRPC = window => poll(() => 'rpc' in window, 1000, 10);

module.exports.onRendererWindow = win => {
    waitForRPC(win).then(() => {
        win.rpc.on('session add', details => {
            const {uid} = details;
            rpc.emit('add-ssh', uid);
        });
    });
};
