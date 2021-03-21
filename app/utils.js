const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

function buildPatientDataObject(
  patientID,
  mrn,
  patientDOB,
  isDeceased,
  dod,
  lastName,
  firstName,
  gender,
  sex,
  address,
  city,
  state,
  zipCode,
  lastModifiedDate,
) {
  return {
    patientID,
    mrn,
    patientDOB,
    isDeceased,
    dod,
    lastName,
    firstName,
    gender,
    sex,
    address,
    city,
    state,
    zipCode,
    lastModifiedDate,
  };
}

function buildTreatmentDataObject(
  treatmentID,
  patientID,
  startDate,
  endDate,
  active,
  displayName,
  diagnoses,
  treatmentLine,
  cyclesDays,
  protocol,
) {
  return {
    treatmentID,
    patientID,
    startDate,
    endDate,
    active,
    displayName,
    diagnoses,
    treatmentLine,
    cyclesDays,
    protocol,
  };
}

function genericAnyValidator() {
  return function (value) {
    return true;
  };
}

function genericLengthValidator(length) {
  return function (value) {
    return value && value.length >= length;
  };
}

function getArgv() {
  return yargs(hideBin(process.argv)).argv;
}

module.exports = {
  genericAnyValidator,
  genericLengthValidator,
  buildPatientDataObject,
  buildTreatmentDataObject,
  getArgv,
};
