const { runConsumer } = require('./messageConsumer');
const { genericLengthValidator, buildTreatmentDataObject, getArgv } = require('./utils');

function mapInitialMessageToDataObject(initialMessage) {
  return buildTreatmentDataObject(
    initialMessage.TreatmentId,
    initialMessage.PatientId,
    initialMessage.StartDate,
    initialMessage.EndDate,
    initialMessage.Status,
    initialMessage.DisplayName,
    initialMessage.AssociatedDiagnoses,
    null,
    (initialMessage.StartDate - initialMessage.EndDate) / initialMessage.NumberOfCycles,
    initialMessage.ProtocolID,
  );
}

const validateMap = [
  ['TreatmentId', genericLengthValidator(3)],
  ['PatientId', genericLengthValidator(3)],
  ['ProtocolID', genericLengthValidator(3)],
  ['StartDate', genericLengthValidator(3)],
  ['EndDate', genericLengthValidator(0)],
  ['Status', genericLengthValidator(3)],
  ['DisplayName', genericLengthValidator(3)],
  ['AssociatedDiagnoses', genericLengthValidator(3)],
  ['NumberOfCycles', genericLengthValidator(3)],
];

async function main() {
  const argv = getArgv();
  const queue = argv.queue || 'data_transfer_queue_2';
  return runConsumer(
    queue,
    validateMap,
    mapInitialMessageToDataObject,
    { patientID: 1, startDate: 1, displayName: 1 },
  );
}

(async () => {
  try {
    await main();
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();
