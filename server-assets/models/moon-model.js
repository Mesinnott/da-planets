let dataAdapter = require('./data-adapter'),
    uuid = dataAdapter.uuid,
    schemator = dataAdapter.schemator,
    DS = dataAdapter.DS;
formatQuery = dataAdapter.formatQuery;

let Moon = DS.defineResource({
    name: 'moon',
    endpoint: 'moons',
    filepath: __dirname + '/../data/moons.db',
    relations: {
        belongsTo: {
            galaxy: {
                localField: 'galaxy',
                localKey: 'galaxyId',

            },
            star: {
                localField: 'star',
                localKey: 'starId',
            },
            planet: {
                localField: 'planet',
                localKey: 'planetId',
                parent: true
            }
        }
    }
})
schemator.defineSchema('Moon', {
    id: {
        type: 'string',
        nullable: false
    },
    name: {
        type: 'string',
        nullable: false
    },
    galaxyId: {
        type: 'string',
        nullable: false
    },
    starId: {
        type: 'string',
        nullable: false
    },
    planetId: {
        type: 'string',
        nullable: false
    }
})


function create(moon, cb) {
    // Use the Resource Model to create a new moon
    DS.find('planet', moon.planetId).then(function (planet) {
        DS.find('star', planet.starId).then(function (star) {
            let moonObj = {
                id: uuid.v4(),
                name: moon.name,
                planetId: moon.planetId,
                starId: planet.starId,
                galaxyId: star.galaxyId
            };
            let error = schemator.validateSync('Moon', moonObj)
            if (error) {
                error.stack
                return cb(error)
            }

            Moon.create(moonObj).then(cb).catch(cb)
        }).catch(cb)
    }).catch(cb)
}

function getAll(query, cb) {
    //Use the Resource Model to get all Galaxies
    Moon.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
    // use the Resource Model to get a single moon by its id
    Moon.find(id, formatQuery(query)).then(cb).catch(cb)
}

module.exports = {
    create,
    getAll,
    getById
}

