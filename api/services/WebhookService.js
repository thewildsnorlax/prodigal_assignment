const fs = require('fs');

module.exports = {

    writeToFile: async function(resourceId, data) {

        // Create a Write stream
        let file = fs.createWriteStream("files/" + resourceId + ".txt")

        // Handle error
        file.on('error', function(error) {
            /* error handling */ 
            console.log(error)
        })

        // Write elements of array one at each line
        data.forEach(function(element) { 
            file.write(element + '\n')
        })
        file.end()
    }
}


