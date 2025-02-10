import cloudinary from "cloudinary";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import RoomModel from "../models/room.js";
import UserModel from "../models/user.js";
import HotelModel from "../models/hotel.js";
import ErrorHandler from "../utills/errorHandle.js";

const sortByPreference = async (rooms) => {
  // Sắp xếp các phòng theo tiêu chí ưu tiên
  rooms.sort((a, b) => {
    // So sánh địa chỉ của khách sạn
    if (a.hotel.address !== b.hotel.address) {
      return a.hotel.address.localeCompare(b.hotel.address);
    }

    // Nếu cùng địa chỉ, ưu tiên theo chênh lệch giá khoảng 200.000
    const priceDifferenceA = Math.abs(a.price - 200000);
    const priceDifferenceB = Math.abs(b.price - 200000);
    if (priceDifferenceA !== priceDifferenceB) {
      return priceDifferenceA - priceDifferenceB;
    }

    // Nếu cùng địa chỉ và chênh lệch giá giống nhau, ưu tiên theo ID hotel
    if (a.hotel._id.toString() !== b.hotel._id.toString()) {
      return a.hotel._id.toString().localeCompare(b.hotel._id.toString());
    }

    // Nếu cùng ID hotel, ưu tiên theo rate của khách sạn
    return parseInt(b.hotel.rate) - parseInt(a.hotel.rate);
  });

  return rooms;
};

export const getTop6RoomSimilar = catchAsyncError(async (req, res, next) => {
  const { hotelId, roomPrice } = req.body;
  const searchCriteria = { status: false };

  if (hotelId) {
    searchCriteria["hotel"] = hotelId;
  }

  if (roomPrice) {
    searchCriteria["price"] = roomPrice;
  }

  const rooms = await RoomModel.find(searchCriteria).populate("hotel");
  console.log(rooms);
  rooms.sort((a, b) => {
    const priceDifferenceA = Math.abs(a.price - 200000);
    const priceDifferenceB = Math.abs(b.price - 200000);
    if (priceDifferenceA !== priceDifferenceB) {
      return priceDifferenceA - priceDifferenceB;
    } else {
      // Nếu chênh lệch giá giống nhau, sắp xếp theo ID khách sạn
      return a.hotel._id.toString().localeCompare(b.hotel._id.toString());
    }
  });
  const top6Rooms = rooms.slice(0, 6);
  res.status(200).json({
    rooms: top6Rooms,
    message: "Get top 6 rooms successfully",
    success: true,
  });
});

export const getRoom = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.findById(req.params.id);
  console.log({ room });

  res.status(200).json({
    room,
    message: "get room successfully",
    success: true,
  });
});
export const getAllRoom = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.find().where({ status: false });
  const roomCount = await RoomModel.count();

  res.status(200).json({
    room,
    message: "get rooms successfully",
    success: true,
    roomCount,
  });
});

export const updateRoomAmount = catchAsyncError(async (req, res, next) => {
  const { roomId, newAmount } = req.body;

  if (!roomId || !newAmount) {
    return next(new ErrorHandler("Room ID and new amount are required", 400));
  }

  try {
    const room = await RoomModel.findById(roomId);

    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }

    // Cập nhật số lượng phòng
    room.amount = newAmount;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Room amount updated successfully",
      updatedRoom: room,
    });
  } catch (error) {
    next(error);
  }
});
export const getAllRoomByHotel = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.find().where({ hotel: req.params.id });
  res.status(200).json({
    room,
    message: "get rooms by hotel successfully",
    success: true,
  });
});

export const getAllAdminRoom = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.find().sort({ status: false });
  const roomCount = await RoomModel.count();

  res.status(200).json({
    room,
    message: "get rooms successfully",
    success: true,
    roomCount,
  });
});
export const createRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.body.user;
  const user = await UserModel.findById(userId);
  if (!user && user != "undefined")
    return next(new ErrorHandler("Not found user ...", 404));
  const hotelId = req.body.hotel;
  const hotel = await HotelModel.findById(hotelId);
  if (!hotel) return next(new ErrorHandler("Not found hotel ...", 404));

  const rooms = req.body.rooms;
  const newRooms = [];
  for (const room of rooms) {
    const newRoom = await new RoomModel({
      user: user._id,
      hotel: hotel._id,
      ...room,
    }).save();
    newRooms.push(newRoom);
  }

  if (!newRooms) return next(new ErrorHandler("Create new room...", 400));

  res.status(200).json({
    newRooms,
    success: true,
    message: "Create rooms successfully!!!",
  });

  // const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
  //   folder: "rooms",
  //   crop: "scale",
  //   width: 330,
  // });

  //const newRoom = await RoomModel.create({
  // img: {
  //   public_id: myCloud.public_id,
  //   url: myCloud.secure_url,
  // },
  //user: user._id,
  // ...req.body,
  //});

  // if (!newRoom) return next(new ErrorHandler("Error new room...", 400));

  // res.status(200).json({
  //   newRoom,
  //   success: true,
  //   message: "Create product successfully!!!",
  // });
});

export const updateRoom = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.findById(req.params.id);
  if (!room) return next(new ErrorHandler("Room not found", 404));

  const updatedRoom = await RoomModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    updatedRoom,
    message: "Update room success",
  });
});

export const roomsByHotel = catchAsyncError(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const rooms = await RoomModel.find({ category: categoryId });
  res.status(200).json({
    rooms,
    message: "get rooms successfully",
    success: true,
  });
});
export const roomStatus = catchAsyncError(async (req, res, next) => {
  const room = await RoomModel.findById(req.params.id);

  if (!room) {
    return next(new ErrorHandler("Not found", 404));
  }

  room.status = !room.status; // change status

  await room.save();

  res.status(200).json({
    room,
    success: true,
  });
});
