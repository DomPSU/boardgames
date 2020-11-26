const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const addID = (entity) => {
  entity.id = entity[Datastore.KEY].id;
  return entity;
};

const isMoreResultsFn = (moreResults) => {
  return moreResults === "MORE_RESULTS_AFTER_LIMIT";
};

module.exports = {
  datastore,
  addID,
  isMoreResultsFn,
};
