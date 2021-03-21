docker run -d --name amqp.test -p 5672:5672 rabbitmq

# To run message Consumer
## Each file contains validation fields and mapping

  node ./app/hospital_1_PatientConsumer.js --queue=data_transfer_queue_1

  node ./app/fileDataProducer.js --fileName=hospital_1_Patient --queue=data_transfer_queue_1 --start=0 --end=3000

  node ./app/brokenLetterConsumer.js


![Process Diagram](https://github.com/OneStromberg/big-csv-parser/blob/master/CSV%20Diagram.png)