let dataAdapter = require('./data-adapter'),
    uuid = dataAdapter.uuid,
    schemator = dataAdapter.schemator,
    DS = dataAdapter.DS,
    formatQuery = dataAdapter.formatQuery;

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
        },
        hasMany: {
            moon: {
                localField: 'moons',
                foreignKey: 'galaxyId'
            },
        creature:[{
          localField: 'creature',
          localKeys: 'creatureIds'
      },{
          localField: 'knownCreatures',
          foreignKeys: 'planetIds'
      }],
    }
    }
})

schemator.defineSchema('Planet', {
   id:{
    type: 'string',
    nullable: false
  },
  name:{
    type: 'string',
    nullable: false
  },
   galaxyId:{
    type:'string',
    nullable:false
  },
   starId:{
    type:'string',
    nullable:false
  }
})

function create(planet, cb) {
    // Use the Resource Model to create a new planet
    DS.find('star', planet.starId).then(function (star) {
        let planetObj = {
            id: uuid.v4(),
            name: planet.name,
            starId: planet.starId,
            galaxyId: star.galaxyId
        };
        let error = schemator.validateSync('Planet', planetObj)
        if (error) {  
            return cb(error)
        }
        Planet.create(planetObj).then(cb).catch(cb)
    }).catch(cb)
}

function getAll(query, cb) {
    //Use the Resource Model to get all Galaxies
    Planet.findAll({}, formatQuery(query)).then(cb).catch(cb)
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

