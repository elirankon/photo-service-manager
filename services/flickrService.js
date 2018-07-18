const request = require('superagent');
const { fetchAndIterate } = require('../utils');

let currentUserId;
async function get({ method, data }) {
    return request
        .get('https://api.flickr.com/services/rest')
        .query(
            Object.assign(
                { api_key: process.env.FLICKR_API_KEY, format: 'json', nojsoncallback: 1 },
                { method },
                data,
            ),
        );
}

function setUserId(userId) {
    currentUserId = userId;
    return currentUserId;
}

async function getUserSets({ limit, next } = {}) {
    const response = await get({
        method: 'flickr.photosets.getList',
        data: {
            user_id: currentUserId,
            page: next,
            perpage: limit,
        },
    });
    return response.body || response.text;
}

async function getAllUserSets() {
    let sets = [];
    await fetchAndIterate(getUserSets, { limit: 10 }, async (response) => {
        sets = sets.concat(response.photosets.photoset);
        if (sets.length < response.photosets.total) {
            return parseInt(response.photosets.page, 10) + 1;
        }
    });

    return sets;
}

module.exports = {
    setUser: setUserId,
    getSets: getAllUserSets,
};
