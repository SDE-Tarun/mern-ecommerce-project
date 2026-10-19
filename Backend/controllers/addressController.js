
import Address from "../models/Address.js";

export async function saveAddress(req, resp) {
  try {
    const {
      userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
    } = req.body;

    if (!userId) {
      return resp.status(400).json({ message: "User ID is required" });
    }

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !addressLine?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return resp.status(400).json({
        message: "Please provide all delivery address details",
      });
    }

    const address = await Address.create({
      userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    });

    return resp.status(201).json({
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    console.error("SAVE ADDRESS ERROR:", error);
    return resp.status(500).json({
      message: "Error in saving address",
      error: error.message,
    });
  }
}

export async function getAddressByUserId(req, resp) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return resp.status(400).json({ message: "User ID is required" });
    }

    const addresses = await Address.find({ userId });

    return resp.status(200).json(addresses);
  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);
    return resp.status(500).json({
      message: "Error in getting addresses",
      error: error.message,
    });
  }
}
