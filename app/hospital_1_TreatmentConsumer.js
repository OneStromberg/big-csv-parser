const { runConsumer } = require('./messageConsumer');
const { genericLengthValidator, buildTreatmentDataObject, getArgv } = require('./utils');

function mapInitialMessageToDataObject(initialMessage) {
  return buildTreatmentDataObject(
    initialMessage.TreatmentID,
    initialMessage.PatientID,
    initialMessage.StartDate,
    initialMessage.EndDate,
    initialMessage.Active,
    initialMessage.DisplayName,
    initialMessage.Diagnoses,
    initialMessage.TreatmentLine,
    initialMessage.CyclesXDays,
  );
}

const validateMap = [
  ['PatientID', genericLengthValidator(3)],
  ['StartDate', genericLengthValidator(3)],
  ['EndDate', genericLengthValidator(3)],
  ['Active', genericLengthValidator(3)],
  ['DisplayName', genericLengthValidator(0)],
  ['Diagnoses', genericLengthValidator(3)],
  ['TreatmentLine', genericLengthValidator(3)],
  ['CyclesXDays', genericLengthValidator(3)],
  ['TreatmentID', genericLengthValidator(3)],
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

main();
