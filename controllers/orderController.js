const Order = require("../models/orderModel");
const CustomPackage = require("../models/customPackageModel");

// Create a new order
exports.createOrder = async (req, res) => {
	try {
		const { user, customPackages } = req.body;
		console.log(user);
		console.log(customPackages);
		const customPackageDetails = [];
		for (const customPackage of customPackages) {
			const existingCustomPackage = await CustomPackage.findById(
				customPackage._id
			);

			if (!existingCustomPackage) {
				return res.status(400).json({
					error: `Produk dengan nama ${customPackage._id} tidak ditemukan.`,
				});
			}

			customPackageDetails.push({
				customPackage: existingCustomPackage._id,
				quantity: customPackage.quantity,
			});
		}
		// Create the order
		const order = await Order.create({
			user,
			customPackages: customPackageDetails,
		});

		res.status(201).json(order);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get all orders
exports.getOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("user", "-password")
			.populate({
				path: "customPackages.customPackage",
				populate: [{ path: "boxType" }, { path: "products.product" }],
			});
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
	try {
		const { Id } = req.params;

		const order = await Order.findById(Id)
			.populate("user", "-password")
			.populate({
				path: "customPackages.customPackage",
				populate: [{ path: "boxType" }, { path: "products.product" }],
			});
		if (!order) {
			return res.status(404).json({ success: false, error: "Order not found" });
		}

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
	try {
	  const { Id } = req.params;
	  const { status } = req.body;
  
	  const order = await Order.findByIdAndUpdate(
		Id,
		{ status },
		{ new: true }
	  );
  
	  if (!order) {
		return res.status(404).json({ success: false, error: "Order not found" });
	  }
  
	  res.status(200).json(order);
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  };
  

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
	try {
		const { Id } = req.params;

		const order = await Order.findByIdAndDelete(Id);

		if (!order) {
			return res.status(404).json({ success: false, error: "Order not found" });
		}

		res
			.status(200)
			.json({ success: true, message: "Order deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get orders by User ID
exports.getOrdersByUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		const orders = await Order.find({ user: userId })
			.populate("user", "-password")
			.populate({
				path: "customPackages.customPackage",
				populate: [{ path: "boxType" }, { path: "products.product" }],
			});

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
