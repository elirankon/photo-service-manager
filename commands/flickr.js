const flickr = require('../services/flickrService');

module.exports = (cli) => {
    cli.command('flickr set user <userId>', 'set the user id').action((args, callback) => {
        flickr.setUser(args.userId);
        callback(`user set to ${args.userId}`);
    });

    cli.command('flickr show sets', 'shows current user sets').action((args, callback) => {
        flickr
            .getSets()
            .then(callback)
            .catch(callback);
    });
};
