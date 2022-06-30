# prodigal-assignment


### Information

+ Written an API to save dummy data to sails-disk DB which is used to simulate streaming data packets. Find Data packets model at api/models/DataPackets  
+ Streaming data packets is simulated by streaming data from DB one by one (api/controllers/StreamController/get)
+ Written an ancillary service to convert payload into processed data (api/services/AncillaryService/convert)
+ Written Webhook service to accept ordered payload and write into a file named as resourceId (api/services/WebhookService/writeToFile)

### Steps to Run
+ clone this repository
+ Install node and sails js
+ Run npm install
+ Run Command sails lift
+ Call API: POST http://localhost:1337/stream (this would load dummy packets data into DB)
+ Call API: GET http://localhost:1337/stream (this would start streaming)
+ The output is saved into "files" folder
