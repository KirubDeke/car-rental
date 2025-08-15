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
    const cars = await db.fleets.findAll();
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

const checkFleetAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const today = new Date();
    date = today.toISOString().split("T")[0];

    const fleet = await db.fleets.findByPk(id);
    if (!fleet) {
      return res.status(404).json({ error: "Fleet not found" });
    }

    const checkDate = new Date(date);
    let isAvailable = true;

    if (fleet.bookedDates && fleet.bookedDates.length > 0) {
      for (const booking of fleet.bookedDates) {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        if (checkDate >= start && checkDate <= end) {
          isAvailable = false;
          break;
        }
      }
    }

    res.status(200).json({
      fleetId: id,
      date,
      available: isAvailable,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//update fleets
const updateFleet = async (req, res) => {
  const { id } = req.params;
  
  try {
    const fleet = await db.fleets.findByPk(id);
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }
    // Prepare update data
    const updateData = {
      brand: req.body.brand || fleet.brand,
      model: req.body.model || fleet.model,
      year: parseInt(req.body.year) || fleet.year,
      plateNumber: req.body.plateNumber || fleet.plateNumber,
      type: req.body.type || fleet.type,
      pricePerDay: req.body.pricePerDay || fleet.pricePerDay,
      fuelType: req.body.fuelType || fleet.fuelType,
      seats: parseInt(req.body.seats) || fleet.seats,
      transmission: req.body.transmission || fleet.transmission,
      description: req.body.description || fleet.description,
      maintenanceMode: req.body.maintenanceMode === 'true' || fleet.maintenanceMode,
      image: req.file ? req.file.filename : fleet.image
    };

    await fleet.update(updateData);

    return res.status(200).json({
      status: "success",
      message: "Fleet updated successfully",
      data: fleet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//delete fleet
const deleteFleet = async (req, res) => {
  const { id } = req.params;
  try {
    const fleet = await db.fleets.findByPk(id);
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }
    await fleet.destroy();
    return res.status(200).json({
      status: "success",
      message: "Fleet removed successfully",
    });
  } catch (error) {
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
  checkFleetAvailability,
  updateFleet,
  deleteFleet,
};
