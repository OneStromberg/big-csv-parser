#!/usr/bin/env node
const { runConsumer } = require('./messageConsumer');
const { genericLengthValidator, buildPatientDataObject, getArgv } = require('./utils');

function mapInitialMessageToDataObject(initialMessage) {
  return buildPatientDataObject(
    initialMessage.PatientId,
    initialMessage.MRN,
    initialMessage.PatientDOB,
    initialMessage.IsPatientDeceased,
    initialMessage.DeathDate,
    initialMessage.LastName,
    initialMessage.FirstName,
    initialMessage.Gender,
    initialMessage.Sex,
    initialMessage.AddressLine,
    initialMessage.AddressCity,
    initialMessage.AddressState,
    initialMessage.AddressZipCode,
  );
}

const validateMap = [
  ['PatientId', genericLengthValidator(3)],
  ['MRN', genericLengthValidator(3)],
  ['PatientDOB', genericLengthValidator(3)],
  ['IsPatientDeceased', genericLengthValidator(3)],
  ['DeathDate', genericLengthValidator(0)],
  ['LastName', genericLengthValidator(3)],
  ['FirstName', genericLengthValidator(3)],
  ['Gender', genericLengthValidator(3)],
  ['Sex', genericLengthValidator(3)],
  ['AddressLine', genericLengthValidator(3)],
  ['AddressCity', genericLengthValidator(3)],
  ['AddressState', genericLengthValidator(2)],
  ['AddressZipCode', genericLengthValidator(3)],
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
