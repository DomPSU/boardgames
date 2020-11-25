const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const fromDatastore = (item) => {
  item.id = item[Datastore.KEY].id;
  return item;
};

const isMoreResultsFn = (moreResults) => {
  return moreResults === "MORE_RESULTS_AFTER_LIMIT";
};

module.exports = {
  datastore,
  fromDatastore,
  isMoreResultsFn,
};