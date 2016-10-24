let dataAdapter = require('./data-adapter'),
    uuid = dataAdapter.uuid,
    schemator = dataAdapter.schemator,
    DS = dataAdapter.DS;
    formatQuery=dataAdapter.formatQuery;

let Planet = DS.defineResource({
    name: 'planet',
    endpoint: 'planets',
    filepath: __dirname + '/../data/planets.db',
    relations: {
        belongsTo: {
            galaxy: {
                localField: 'galaxy',
                localKey: 'galaxyId',

            },
            star: {
                localField: 'star',
                localKey: 'starId',
                parent: true
            }
        }
    }
})


function create(planet, cb) {
    // Use the Resource Model to create a new planet
    DS.find('star', planet.starId).then(function (star) {
        Planet.create({
            id: uuid.v4(),
            name: planet.name,
            starId: planet.starId,
            galaxyId: star.galaxyId
        })
            .then(cb).catch(cb)

    }).catch(cb)
}

function getAll(query, cb) {
    //Use the Resource Model to get all Galaxies
    Planet.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
    // use the Resource Model to get a single planet by its id
    Planet.find(id, formatQuery(query)).then(cb).catch(cb)
}

module.exports = {
    create,
    getAll,
    getById
}

