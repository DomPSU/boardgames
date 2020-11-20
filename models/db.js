const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const fromDatastore = (item) => {
  item.id = item[Datastore.KEY].id;
  return item;
}

module.exports = {
  datastore,
  fromDatastore,
}