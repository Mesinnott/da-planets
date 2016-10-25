// SAVE ME FOR LAST I GET CRAZY FAST

let dataAdapter = require('./data-adapter'),
  uuid = dataAdapter.uuid,
  schemator = dataAdapter.schemator,
  DS = dataAdapter.DS;
  formatQuery=dataAdapter.formatQuery;

let Creature = DS.defineResource({
  name: 'creature',
  endpoint: 'creatures',
  filepath: __dirname + '/../data/creatures.db',
  relations: {
    hasMany: {
      galaxy: [{
        localField: 'galaxies',
        localKeys: 'galaxyIds'
      },{
          localField: 'knownGalaxies',
          foreignKeys: 'creatureIds'  
      }],
      planet:[{
          localField: 'planets',
          localKeys: 'planetIds'
      },{
          localField: 'knownPlanets',
          foreignKeys: 'creatureIds'
      }],
      moon:[{
          localField: 'moon',
          localKeys: 'moonIds'
      },{
          localField: 'knownMoons',
          foreignKeys: 'creatureIds'
      }],
      star:[{
          localField: 'stars',
          localKeys: 'starIds'
      },{
          localField: 'knownStars',
          foreignKeys: 'creatureIds'
      }],
    }
  }
})
     

schemator.defineSchema('Creature', {
   id:{
    type: 'string',
    nullable: false
  },
  name:{
    type: 'string',
    nullable: false
  }
})



function create(creature, cb) {
  // Use the Resource Model to create a new galaxy
let creatureObj ={
    id: uuid.v4(),
    name: creature.name,
    galaxyIds: {}
}
  
  Creature.create(creatureObj).then(cb).catch(cb)
}


// function inhabitGalaxy(creatureId, input, cb){
//     if (input.galaxyId){
//     DS.find('galaxy', galaxyId).then(function(galaxy){
//         Creature.find(creatureId).then(function(creature){

//             creature.galaxyIds[galaxyId]= galaxyId;
//             galaxy.creatureIds = galaxy.creatureIds || {}
//             galaxy.creatureIds[creatureId] = creatureId;

//             Creature.update(creature).then(function(){
//                 DS.update('galaxy', galaxyId, galaxy)
//                 .then(cb)
//                 .catch(cb)
//             }).catch(cb)

//         }).catch(cb)
//     }).catch(cb)
// }
// }
function inhabitGalaxy(creatureId, input, cb){
    let location= ''
    let locId=''
    let locIds=''
    if (input.galaxyId){
        location='galaxy'
        locId= input.galaxyId
        locIds='galaxyIds'
        // Location='Galaxy'
    }
    if (input.planetId){
        location='planet'
        locId= input.planetId
        locIds='planetIds'
        // Location='Planet'
    }
    if (input.moonId){
        location='moon'
        locId= input.moonId
        locIds='moonIds'
        // Location='Moon'
    }
    if (input.starId){
        location='star'
        locId= input.starId
        locIds='starIds'
        // Location='Star'
    }

    DS.find(location, locId).then(function(place){


        Creature.find(creatureId).then(function(creature){
            creature[locIds] = creature[locIds] || {}
            creature[locIds][locId]= locId;
            place.creatureIds = place.creatureIds || {}
            place.creatureIds[creatureId] = creatureId;

            Creature.update(creature.id, creature).then(function(){
                DS.update(location, locId, place)
                .then(cb)
                .catch(cb)
            }).catch(cb)

        }).catch(cb)
    }).catch(cb)
}
// if (input.planetId){
//     DS.find('planet', input.planetId).then(function(planet){
//         Creature.find(creatureId).then(function(creature){

//             creature.planetIds[input.planetId]= input.planetId;
//             planet.creatureIds = planet.creatureIds || {}
//             planet.creatureIds[creatureId] = creatureId;

//             Creature.update(creature.id, creature).then(function(){
//                 DS.update('planet', planet.id, planet)
//                 .then(cb)
//                 .catch(cb)
//             }).catch(cb)

//         }).catch(cb)
//     }).catch(cb)
// }

// }
// }
//  if(input.galaxyId){
//     DS.find('galaxy', galaxyId).then(function(galaxy){
//         Creature.find(creatureId).then(function(creature){

//             creature.galaxyIds[input.galaxyId]= input.galaxyId;
//             galaxy.creatureIds = galaxy.creatureIds || {}
//             galaxy.creatureIds[creatureId] = creatureId;

//             Creature.update(creature).then(function(){
//                 DS.update('galaxy', galaxyId, galaxy)
//                 .then(cb)
//                 .catch(cb)
//             }).catch(cb)

//         }).catch(cb)
//     }).catch(cb)

// }







// function inhabitWorld(creatureId, input, cb){
//     if(input.planetId){
//     DS.find('planet', planetId).then(function(planet){
//         Creature.find(creatureId).then(function(creature){


//         })
//     })

//     }
// }



function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Creature.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single galaxy by its id
  Creature.find(id, formatQuery(query)).then(cb).catch(cb)
}



module.exports = {
  create,
  getAll,
  inhabitGalaxy,
  getById
}
