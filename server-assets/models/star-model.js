let dataAdapter = require('./data-adapter'),
  uuid = dataAdapter.uuid,
  schemator = dataAdapter.schemator,
  DS = dataAdapter.DS;
  formatQuery=dataAdapter.formatQuery;

let Star = DS.defineResource({
  name: 'star',
  endpoint: 'stars',
  filepath: __dirname + '/../data/stars.db',
  relations: {
    belongsTo: {
      galaxy: {
        localField: 'galaxy',
        localKey: 'galaxyId'
      }
    },
    hasMany: {
      planet:{
        localField: 'planets',
        foreignKey: 'starId'
      },
      moon:{
        localField: 'moons',
        foreignKey: 'starId'
      }

    }
  }
})

schemator.defineSchema('Star', {
  id:{
    type:'string',
    nullable:false
  },
  name:{
    type: 'string',
    nullable: false
  },
  galaxyId:{
    type:'string',
    nullable:false
  },
  temp:{
    type: 'Number',
  },
  color:{
    type:'string',
  }
})


function create(star, cb) {
  // Use the Resource Model to create a new star\
  let temp = ''
  if(star.temp && typeof star.temp === 'number'){temp=star.temp
  }else{temp='none'}
  let starColor=''
  if(temp=='none'){starColor='unknown'}
  if(temp<=3700){starColor='red'}
  if(temp>3700 && temp<=5200){starColor='orange'}
  if(temp>5200 && temp<=6000){starColor='yellow'}
  if(temp>6000 && temp<=7500){starColor='yellowish-white'}
  if(temp>7500 && temp<=10000){starColor='white'}
  if(temp>10000 && temp<=30000){starColor='blue-white'}
  if(temp>30000){starColor='blue'}
  let starObj= { id: uuid.v4(), name: star.name, temp: temp, color: starColor, galaxyId: star.galaxyId};
  let error = schemator.validateSync('Star', starObj)
  if(error){
    error.stack
    return cb(error)
  }
  Star.create(starObj).then(cb).catch(cb)
}

function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Star.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single star by its id
  Star.find(id, formatQuery(query)).then(cb).catch(cb)
}

module.exports = {
  create,
  getAll,
  getById
}

