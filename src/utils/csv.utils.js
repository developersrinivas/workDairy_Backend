const { createWriteStream } = require('fs');
const { Transform } = require('stream');
const csv = require('fast-csv');

const formatTripForCSV = (trip) => {
  const rows = [];
  
  if (trip.loads && trip.loads.length > 0) {
    trip.loads.forEach(load => {
      rows.push({
        'Trip Date': new Date(trip.date).toLocaleDateString(),
        'Vehicle Name': trip.vehicleId?.name || 'N/A',
        'Vehicle Type': trip.vehicleId?.type || 'N/A',
        'Vehicle Count': trip.vehicleCount,
        'Route From': trip.routeFrom,
        'Route To': trip.routeTo,
        'Load Number': load.loadNo,
        'Quantity': load.quantity || 0,
        'Unit': load.unit || '',
        'Members Count': load.membersCount || 0,
        'Mode': load.mode || trip.settingsUsed?.mode || 'mixed',
        'Rate Override': load.rateOverride || '',
        'Amount': load.amount || 0,
        'Load Notes': load.notes || '',
        'Trip Remarks': trip.remarks || '',
        'Created By': trip.createdBy?.name || 'N/A',
        'Created At': new Date(trip.createdAt).toLocaleString(),
      });
    });
  } else {
    rows.push({
      'Trip Date': new Date(trip.date).toLocaleDateString(),
      'Vehicle Name': trip.vehicleId?.name || 'N/A',
      'Vehicle Type': trip.vehicleId?.type || 'N/A',
      'Vehicle Count': trip.vehicleCount,
      'Route From': trip.routeFrom,
      'Route To': trip.routeTo,
      'Load Number': '',
      'Quantity': 0,
      'Unit': '',
      'Members Count': 0,
      'Mode': trip.settingsUsed?.mode || 'mixed',
      'Rate Override': '',
      'Amount': 0,
      'Load Notes': '',
      'Trip Remarks': trip.remarks || '',
      'Created By': trip.createdBy?.name || 'N/A',
      'Created At': new Date(trip.createdAt).toLocaleString(),
    });
  }
  
  return rows;
};

const generateTripsCSV = (trips, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=trips_export.csv');

  const csvStream = csv.format({ headers: true });
  csvStream.pipe(res);

  trips.forEach(trip => {
    const rows = formatTripForCSV(trip);
    rows.forEach(row => {
      csvStream.write(row);
    });
  });

  csvStream.end();
};

const generatePaymentsCSV = (payments, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=payments_export.csv');

  const csvStream = csv.format({ headers: true });
  csvStream.pipe(res);

  payments.forEach(payment => {
    csvStream.write({
      'Payment Date': new Date(payment.date).toLocaleDateString(),
      'Labour Name': payment.labourId?.name || 'N/A',
      'Labour Phone': payment.labourId?.phone || 'N/A',
      'Amount': payment.amount,
      'Notes': payment.notes || '',
      'Created At': new Date(payment.createdAt).toLocaleString(),
    });
  });

  csvStream.end();
};

module.exports = {
  formatTripForCSV,
  generateTripsCSV,
  generatePaymentsCSV,
};
