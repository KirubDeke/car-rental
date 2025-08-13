module.exports = (sequelize, DataTypes) => {
  const Fleet = sequelize.define("Fleet", {
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    plateNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fuelType: DataTypes.STRING,
    seats: DataTypes.INTEGER,
    transmission: DataTypes.STRING,
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    bookedDates: {
      type: DataTypes.JSON,
      defaultValue: [],
      index: true
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  // Check availability for requested dates
  Fleet.prototype.isAvailableForDates = function (startDate, endDate) {
    if (!this.availability || this.maintenanceMode) return false;

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    for (const period of this.bookedDates || []) {
      const bookedStart = new Date(period.startDate);
      const bookedEnd = new Date(period.endDate);

      if (
        (requestedStart >= bookedStart && requestedStart <= bookedEnd) ||
        (requestedEnd >= bookedStart && requestedEnd <= bookedEnd) ||
        (requestedStart <= bookedStart && requestedEnd >= bookedEnd)
      ) {
        return false;
      }
    }

    return true;
  };

  return Fleet;
};
