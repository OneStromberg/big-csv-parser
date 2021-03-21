#!/usr/bin/env node
const { runConsumer } = require('./messageConsumer');
const {
  genericLengthValidator,
  buildPatientDataObject,
  getArgv,
  genericAnyValidator,
} = require('./utils');

function mapInitialMessageToDataObject(initialMessage) {
  return buildPatientDataObject(
    initialMessage.PatientID,
    initialMessage.MRN,
    initialMessage.PatientDOB,
    initialMessage.IsDeceased,
    initialMessage.DOD_TS,
    initialMessage.LastName,
    initialMessage.FirstName,
    initialMessage.Gender,
    initialMessage.Sex,
    initialMessage.Address,
    initialMessage.City,
    initialMessage.State,
    initialMessage.ZipCode,
    initialMessage.LastModifiedDate,
  );
}

const validateMap = [
  ['PatientID', genericLengthValidator(3)],
  ['MRN', genericLengthValidator(3)],
  ['PatientDOB', genericLengthValidator(3)],
  ['IsDeceased', genericLengthValidator(3)],
  ['DOD_TS', genericAnyValidator()],
  ['LastName', genericLengthValidator(3)],
  ['FirstName', genericLengthValidator(3)],
  ['Gender', genericLengthValidator(3)],
  ['Sex', genericLengthValidator(3)],
  ['Address', genericLengthValidator(3)],
  ['City', genericLengthValidator(3)],
  ['State', genericLengthValidator(2)],
  ['ZipCode', genericLengthValidator(3)],
  ['LastModifiedDate', genericLengthValidator(3)],
];

async function main() {
  const argv = getArgv();
  const queue = argv.queue || 'data_transfer_queue_2';

  return runConsumer(
    queue,
    validateMap,
    mapInitialMessageToDataObject,
    { patientID: 1, patientDOB: 1 },
  );
}

(async () => {
  try {
    await main();
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();
