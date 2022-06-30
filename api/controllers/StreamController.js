var cache = {}

module.exports = {

    // Stream Data from DB one by one
    get: async function(req, res) {

        // We will mimic data streaming by streaming data from DB
        await DataPackets.stream()
        .eachRecord(async function (packet) {

            console.log('received packet')
            console.log(packet)

            console.log('Calling Ancillary service')
            // Call ancillary service to get processed payload
            let convertedPayload = await AncillaryService.convert(packet.payload)

            console.log('Storing the packet in Cache')
            // Store this packet info in cache
            if(!cache.hasOwnProperty(packet.resourceId)) 
                cache[packet.resourceId] = []
            let packetCache = {convertedPayload: convertedPayload, index: packet.index}
            cache[packet.resourceId].push(packetCache)
            console.log(packetCache)
            // If this is the last packet, 
            // Acc to our measure of out of order, no packet will be out of order for more than 60 second
            // So wait for 60 seconds before concatenating and calling the webhook
            if(packet.isLastChunk) {    
                console.log('This is the last packet')
                setTimeout(function(){ 
                    console.log('Calling webhook for resourceId: ', packet.resourceId)  
                    callWebhook(packet.resourceId)
                }, 60000)
            }
        })
    },

    // Write Dummy Data into DB - for testing
    post: async function (req, res) {
        console.log('post')
        let data = [
            {
                resourceId: '1',
                payload: "a bb ccc",
                index: 1,
                isLastChunk: false
            },
            {
                resourceId: '1',
                payload: "ffffff",
                index: 3,
                isLastChunk: true
            },
            {
                resourceId: '1',
                payload: "dddd eeeee",
                index: 2,
                isLastChunk: false
            },
            {
                resourceId: '2',
                payload: "a ab abc abcd abcde",
                index: 1,
                isLastChunk: true
            },
            {
                resourceId: '3',
                payload: "abcde abcdef",
                index: 2,
                isLastChunk: false
            },
            {
                resourceId: '3',
                payload: "a ab abc abcd",
                index: 1,
                isLastChunk: false
            },
            {
                resourceId: '3',
                payload: "abcdefg abcdefgh",
                index: 3,
                isLastChunk: true
            },
        ]

        try {
            await DataPackets.createEach(data)
            return res.ok()
        }
        catch (error) {
            return res.serverError(error)
        }

    }
}


function callWebhook (resourceId) {
    
    // Get all packets from cache
    let allPackets = cache[resourceId]

    // Order the packets
    allPackets.sort(function (a, b) {return a.index - b.index})

    // Concat the payload
    let concatenatedPayload = []
    for(let i = 0; i < allPackets.length; i++) {
        concatenatedPayload = concatenatedPayload.concat(allPackets[i].convertedPayload)
    }

    console.log(concatenatedPayload)

    // Call webhook
    WebhookService.writeToFile(resourceId, concatenatedPayload)
}