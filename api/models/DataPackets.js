module.exports = {

    tableName: 'DataPackets',

    attributes: {

        // The primary key for the data packet stream
        resourceId   : {
            type: 'string'
        },

        // Some sort of binary data, for simplification this would be multiple words separated by space
        payload: {
            type: 'string'
        },

        // Order of the data packet
        index: {
            type: 'number'
        },

        // Flag indicating if it is the last data chunk
        isLastChunk: {
            type: 'boolean'
        }
    }
}