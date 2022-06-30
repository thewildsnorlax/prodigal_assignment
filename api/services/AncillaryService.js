module.exports = {

    convert: async function(payload) {

        // Split into words
        let wordArray = payload.split(" ")
       
        for(let i = 0; i < wordArray.length; i++) {
            wordArray[i] = wordArray[i].length 
        }
       
        return wordArray
    }
}