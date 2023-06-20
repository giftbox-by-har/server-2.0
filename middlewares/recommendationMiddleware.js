const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const CustomPackage = require("../models/customPackageModel");

// Fungsi untuk melakukan collaborative filtering
exports.getCollaborativeFilteringRecommendations = async (user) => {
	try {
		let similarUsers = [];
		if (user.age & user.gender) {
			similarUsers = await User.find({
				age: {
					$gte: parseInt(user.age) - 5,
					$lte: parseInt(user.age) + 5,
				},
				gender: user.gender,
			});
		} else {
			return similarUsers;
		}
		let productsWithQuantity = [];
		if (similarUsers) {
		}
		for (const similarUser of similarUsers) {
			const customPackages = await CustomPackage.find({
				user: similarUser._id,
			})
				.populate("products.product")
				.exec();

			for (const customPackage of customPackages) {
				for (const product of customPackage.products) {
					const existingProduct = productsWithQuantity.find(
						(p) => p.product._id.toString() === product.product._id.toString()
					);

					// console.log(product);
					if (existingProduct) {
						existingProduct.quantity += product.quantity;
					} else {
						productsWithQuantity.push({
							product: product.product,
							quantity: product.quantity,
						});
					}
				}
			}
		}

		let sortedProducts = [];
		sortedProducts = productsWithQuantity
			.sort((a, b) => b.quantity - a.quantity)
			.map((productWithQuantity) => productWithQuantity.product);
		// console.log(sortedProducts);
		return sortedProducts;
	} catch (error) {
		throw new Error(error.message);
	}
};

exports.getContentBasedRecommendations = async (user) => {
	try {
		let customPackages = [];
		customPackages = await CustomPackage.find({ user: user._id }).populate(
			"products.product"
		);
		if (customPackages.length === 0) {
			return customPackages;
		}
		// console.log(customPackages);
		let productsWithQuantity = [];
		for (const customPackage of customPackages) {
			for (const product of customPackage.products) {
				const existingProduct = productsWithQuantity.find(
					(p) => p.product._id.toString() === product.product._id.toString()
				);

				// console.log(product);
				if (existingProduct) {
					existingProduct.quantity += product.quantity;
				} else {
					productsWithQuantity.push({
						product: product.product,
						quantity: product.quantity,
					});
				}
			}
		}

		const productAttributes = productsWithQuantity.map((product) => ({
			category: product.product.category,
			brand: product.product.brand,
			// productName: product.product.productName,
			// description: product.product.description,
		}));

		let recommendedProducts = [];
		recommendedProducts = await Product.find({
			$or: productAttributes.map((attribute) => ({
				category: attribute.category,
				brand: attribute.brand,
				// productName: attribute.productName,
				// description: attribute.description,
			})),
		});

		return recommendedProducts;
	} catch (error) {
		throw new Error(error.message);
	}
};

exports.combineRecommendations = async (
	collaborativeFilteringRecommendations,
	contentBasedRecommendations
) => {
	try {
		const uniqueProductIds = new Set();
		const finalRecommendations = [];

		// Menambahkan rekomendasi dari collaborative filtering
		for (const recommendation of collaborativeFilteringRecommendations) {
			const productId = recommendation._id.toString();
			if (!uniqueProductIds.has(productId)) {
				uniqueProductIds.add(productId);
				finalRecommendations.push(recommendation);
			}
		}

		// Menambahkan rekomendasi dari content-based filtering
		for (const recommendation of contentBasedRecommendations) {
			const productId = recommendation._id.toString();
			if (!uniqueProductIds.has(productId)) {
				uniqueProductIds.add(productId);
				finalRecommendations.push(recommendation);
			}
		}

		let topRecommendations = [];
		topRecommendations = finalRecommendations.slice(0, 5);

		// console.log(topRecommendations);
		return topRecommendations;
	} catch (error) {
		throw new Error(error.message);
	}
};
