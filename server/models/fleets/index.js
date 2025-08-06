module.exports = (sequelize, DataTypes) => {
  const Fleet = sequelize.define("Fleet", {
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    fuelType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: true
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  });
  return Fleet;
};
