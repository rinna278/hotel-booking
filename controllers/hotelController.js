import cloundinary from "cloudinary";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utills/errorHandle.js";
import {
  CategoryModel,
  HotelModel,
  RoomModel,
  UserModel,
} from "../models/index.js";

function calculateDistance(lat, lon, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất trong kilometers
  const dLat = ((lat2 - lat) * Math.PI) / 180; // Đổi độ sang radian
  const dLon = ((lon2 - lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Khoảng cách giữa hai điểm

  return distance;
}
export const getAllHotel = catchAsyncError(async (req, res, next) => {
  const { lat, lon } = req.body;

  if (lat !== "" && lon !== "") {
    const hotels = await HotelModel.find().where({ status: true });
    if (lat && lon) {
      hotels.forEach((hotel) => {
        let distance = 0;
        distance = calculateDistance(
          lat,
          lon,
          hotel.location.lat,
          hotel.location.lng
        );
        hotel._doc.distanceFromCurrentLocation = distance.toFixed(2);
      });
    }
    res.status(200).json({
      hotels,
      message: "get hotel successfully",
      success: true,
    });
  } else {
    const hotels = await HotelModel.find().where({ status: true });
    res.status(200).json({
      hotels,
      message: "get hotel successfully",
      success: true,
    });
  }
});
export const getCountHotel = catchAsyncError(async (req, res, next) => {
  const counthotel = await HotelModel.count();
  res.status(200).json({
    counthotel,
    message: "get hotel successfully",
    success: true,
  });
});
export const getAllHotelMain = catchAsyncError(async (req, res, next) => {
  const hotel = await HotelModel.find().sort();
  const hotelCount = await HotelModel.count();

  res.status(200).json({
    hotel,
    message: "get all hotel successfully",
    success: true,
    hotelCount,
  });
});

export const deleteHotelAndRoom = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  try {
    // Xóa tất cả các phòng có liên quan đến khách sạn
    await RoomModel.deleteMany({ hotel: id });

    // Xóa khách sạn
    const deletedHotel = await HotelModel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({
      success: true,
      message: "Hotel and associated rooms deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
export const createHotel = catchAsyncError(async (req, res, next) => {
  const hotels = req.body.hotels;
  const userId = req.body.userId;
  const user = await UserModel.findById(userId);
  if (!user) return next(new ErrorHandler("Not found user...", 404));
  const categoryId = req.body.categoryId;
  const category = await CategoryModel.findById(categoryId);
  if (!category) return next(new ErrorHandler("Not found category...", 404));

  const newHotels = [];

  for (const hotel of hotels) {
    const newHotel = await new HotelModel({
      name: hotel.name,
      desc: hotel.desc,
      image: hotel.image,
      address: hotel.address,
      rate: hotel.rate,
      location: hotel.location,
      extra: hotel.extra,
      user: user._id,
      categoryId: category._id,
    }).save();
    newHotels.push(newHotel);
  }
  console.log(newHotels);

  res.status(200).json({
    newHotels,
    success: true,
    message: "Create hotels successfully!!!",
  });
});
export const getOneHotel = catchAsyncError(async (req, res, next) => {
  const { lat, lon } = req.body;
  const hotel = await HotelModel.findById(req.params.id).select("-user");
  if (!hotel) return next(new ErrorHandler("Error get hotel ...", 400));
  let distance = 0;
  if (lat && lon) {
    distance = calculateDistance(
      lat,
      lon,
      hotel.location.lat,
      hotel.location.lng
    );
    hotel.distanceFromCurrentLocation = distance.toFixed(2);
  }

  res.status(200).json({
    hotel,
    success: true,
    distanceFromCurrentLocation: distance.toFixed(2),
    message: "Get hotel id successfully!!!",
  });
});
export const updateHotel = catchAsyncError(async (req, res, next) => {
  const hotel = await HotelModel.findById(req.params.id);
  if (!hotel) return next(new ErrorHandler("hotel not found", 404));

  const updatehotel = await HotelModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    updatehotel,
    message: "update hotel success",
  });
});
export const updateHotelStatus = catchAsyncError(async (req, res, next) => {
  const hotel = await HotelModel.findById(req.params.id);

  if (!hotel) {
    return next(new ErrorHandler("Not found", 404));
  }
  if (hotel.status == true) {
    hotel.status = false;
  } else {
    hotel.status = true;
  }
  await hotel.save();

  res.status(200).json({
    hotel,
    success: true,
  });
});

export const getAllByLocation = catchAsyncError(async (req, res, next) => {
  const { address } = req.params;
  console.log(address);
  const hotel = await HotelModel.find()
    .where({ status: true, address: address })
    .sort();
  const hotelCount = await HotelModel.count();

  res.status(200).json({
    hotel,
    message: "get all hotel successfully",
    success: true,
    hotelCount,
  });
});

export const getAllHotelByLocation = catchAsyncError(async (req, res, next) => {
  const { address } = req.body;

  // Tìm tất cả các khách sạn có địa chỉ chứa địa điểm được truyền vào
  const hotels = await HotelModel.find().where({
    address: address,
  });

  return hotels;
});
