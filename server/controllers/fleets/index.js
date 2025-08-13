const db = require("../../models");

const createFleets = async (req, res) => {
  const {
    brand,
    model,
    year,
    plateNumber,
    type,
    pricePerDay,
    fuelType,
    seats,
    transmission,
    description,
  } = req.body;

  const image = req.file?.filename;

  try {
    const car = await db.fleets.findOne({ where: { plateNumber } });

    if (car) {
      return res.status(400).json({
        status: "fail",
        message: "Fleet already exists",
      });
    }

    const data = {
      brand,
      model,
      year,
      plateNumber,
      type,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      image,
      description,
    };

    const newCar = await db.fleets.create(data);

    return res.status(201).json({
      status: "success",
      message: "Fleet created successfully",
      data: newCar,
    });
  } catch (error) {
    console.error("Error creating fleet:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// GET /fleets
const getAllFleets = async (req, res) => {
  try {
    const cars = await db.fleets.findAll({ where: { availability: true} });
    const totalCar = await db.fleets.count();
    return res.status(200).json({
      status: "success",
      message: "All fleets fetched successfully",
      data: cars,
      total: totalCar,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
// GET /fleets/:id
const getFleetById = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await db.fleets.findByPk(id);

    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fleet fetched successfully",
      data: car,
    });
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createFleets,
  getAllFleets,
  getFleetById,
};
