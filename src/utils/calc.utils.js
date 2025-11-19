const calculateLoadAmount = (load, settings) => {
  if (load.rateOverride !== undefined && load.rateOverride !== null) {
    return Math.round(load.rateOverride);
  }

  let mode;
  if (load.mode) {
    mode = load.mode;
  } else if (settings.mode) {
    mode = settings.mode;
  } else {
    mode = 'mixed';
  }

  const rates = settings.ratesSnapshot || {
    per_load_rate: process.env.DEFAULT_PER_LOAD_RATE || 100,
    per_member_rate: process.env.DEFAULT_PER_MEMBER_RATE || 50,
    per_unit_rate: process.env.DEFAULT_PER_UNIT_RATE || 10,
  };

  let amount = 0;

  switch (mode) {
    case 'per_load':
      amount = rates.per_load_rate * 1;
      break;
    case 'per_member':
      amount = (load.membersCount || 0) * rates.per_member_rate;
      break;
    case 'per_unit':
      amount = (load.quantity || 0) * rates.per_unit_rate;
      break;
    case 'mixed':
      if (load.quantity && load.quantity > 0) {
        amount = load.quantity * rates.per_unit_rate;
      } else if (load.membersCount && load.membersCount > 0) {
        amount = load.membersCount * rates.per_member_rate;
      } else {
        amount = rates.per_load_rate * 1;
      }
      break;
    case 'gaddulu':
      const gadduluTotal = (load.totalGaddulu || 0) * (load.ratePerGaddu || 0);
      const gadduluShare = load.membersCount > 0 ? gadduluTotal / load.membersCount : 0;
      return {
        amount: Math.round(gadduluTotal),
        sharePerMember: Math.round(gadduluShare)
      };
    case 'trip_share':
      const tripShareTotal = (load.tripsCount || 0) * (load.ratePerTrip || 0);
      const tripShare = load.labourCount > 0 ? tripShareTotal / load.labourCount : 0;
      return {
        amount: Math.round(tripShareTotal),
        sharePerLabour: Math.round(tripShare)
      };
    default:
      amount = rates.per_load_rate * 1;
  }

  return Math.round(amount);
};

const calculateTripTotals = (tripDoc, settings) => {
  const trip = tripDoc.toObject ? tripDoc.toObject() : tripDoc;
  
  let totalAmount = 0;
  let totalLoads = 0;
  let totalMembers = 0;

  if (trip.loads && trip.loads.length > 0) {
    trip.loads.forEach(load => {
      const result = calculateLoadAmount(load, settings);
      
      // Handle both simple amount and object with shares
      if (typeof result === 'object' && result.amount !== undefined) {
        load.amount = result.amount;
        if (result.sharePerMember) {
          load.sharePerMember = result.sharePerMember;
        }
        if (result.sharePerLabour) {
          load.sharePerLabour = result.sharePerLabour;
        }
        totalAmount += result.amount;
      } else {
        load.amount = result;
        totalAmount += result;
      }
      
      totalLoads += 1;
      totalMembers += load.membersCount || 0;
    });
  }

  return {
    ...trip,
    loads: trip.loads,
    totals: {
      totalAmount,
      totalLoads,
      totalMembers,
    },
  };
};

module.exports = {
  calculateLoadAmount,
  calculateTripTotals,
};
