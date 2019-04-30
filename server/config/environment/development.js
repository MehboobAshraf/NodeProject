/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri:  'mongodb://test:test@ds061681.mlab.com:61681/dummies'
        // local uri `process.env.MONGODB_URI ||`
    },

    // Seed database on startup
    seedDB: true,
};
