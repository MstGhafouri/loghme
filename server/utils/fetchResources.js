const loghmeApi = require('../api/loghmeApi');

module.exports = async resource => {
  try {
    const response = await loghmeApi.get(`/${resource}`);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error in fetching resource: ${resource}`, error);
    return [];
  }
};
