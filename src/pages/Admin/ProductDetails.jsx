import React from 'react';
import {
	Search,
	Plus,
	Layers,
	Edit,
	Trash2,
	AlertTriangle,
	Package,
	PackagePlus,
	X,
	ImagePlus
} from 'lucide-react';

const statusStyles = {
	Active: 'bg-green-700/25 text-green-300',
	Live: 'bg-green-700/25 text-green-300',
	Draft: 'bg-amber-700/25 text-amber-200',
	'Low Stock': 'bg-red-700/25 text-red-300',
	Archived: 'bg-gray-700/25 text-gray-300',
	default: 'bg-gray-700/25 text-gray-300'
};

const formatDateIdentifier = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const generateReferenceByType = (type) => {
	const datePart = formatDateIdentifier();
	if (type === 'IN') {
		const hourSuffix = String(new Date().getHours()).padStart(2, '0');
		return `PO-${datePart}-${hourSuffix}`;
	}
	if (type === 'OUT') {
		return `ADJ-${datePart}`;
	}
	return `MAN-${datePart}`;
};

const generateAutoNoteText = (quantityValue) => {
	const quantityNumber = Number(quantityValue);
	const hasQuantity = Number.isFinite(quantityNumber) && quantityNumber > 0;
	const quantityText = hasQuantity ? `${quantityNumber}` : 'incoming';
	return hasQuantity
		? `Restocked ${quantityText} units. Batch date: ${formatDateIdentifier()}.`
		: `Restocked units. Batch date: ${formatDateIdentifier()}.`;
};

const movementVisuals = {
	IN: {
		active: 'border-green-500 bg-green-600/20 shadow-[0_0_18px_rgba(34,197,94,0.25)]',
		idle: 'border-white/10 bg-white/5 hover:border-green-500/50 hover:bg-green-600/10',
		dot: 'bg-green-400',
		text: 'text-green-200'
	},
	OUT: {
		active: 'border-red-500 bg-red-600/20 shadow-[0_0_18px_rgba(248,113,113,0.25)]',
		idle: 'border-white/10 bg-white/5 hover:border-red-500/50 hover:bg-red-600/10',
		dot: 'bg-red-400',
		text: 'text-red-200'
	},
	ADJUST: {
		active: 'border-amber-500 bg-amber-500/15 shadow-[0_0_18px_rgba(251,191,36,0.22)]',
		idle: 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-amber-500/10',
		dot: 'bg-amber-300',
		text: 'text-amber-100'
	}
};

const movementPanels = {
	IN: 'border-green-500/40 bg-green-600/15 text-green-100',
	OUT: 'border-red-500/40 bg-red-600/15 text-red-100',
	ADJUST: 'border-amber-500/40 bg-amber-500/15 text-amber-100'
};

const ProductDetails = () => {
	const [showProductModal, setShowProductModal] = React.useState(false);
	const [showStockModal, setShowStockModal] = React.useState(false);
	const [productList, setProductList] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [productForm, setProductForm] = React.useState({
		name: '',
		sku: '',
		category: '',
		status: 'Draft',
		price: '',
		imageFile: null,
		imagePreview: ''
	});
	const [editingProductId, setEditingProductId] = React.useState(null); // null = add, id = edit
	const [stockForm, setStockForm] = React.useState(() => ({
		productId: '',
		changeType: 'IN',
		quantity: '',
		unitCost: '',
		reference: generateReferenceByType('IN'),
		note: ''
	}));
	const [stockError, setStockError] = React.useState('');
	const autoNoteRef = React.useRef('');

	const statusOptions = ['Draft','Active','Out of Stock','Archived','Discontinued'];
	const changeTypes = [
		{ value: 'IN', label: 'Incoming stock' },
		{ value: 'OUT', label: 'Stock deduction' },
		{ value: 'ADJUST', label: 'Manual adjustment' }
	];

	const topProducts = productList.slice(0, 3);
	const productImageInputRef = React.useRef(null);
	const [isImageDragging, setIsImageDragging] = React.useState(false);

	// Calculate product summary from live data
	const productSummary = React.useMemo(() => {
		const liveCount = productList.filter(p => p.status === 'Live' || p.status === 'Active').length;
		const draftCount = productList.filter(p => p.status === 'Draft').length;
		const lowStockCount = productList.filter(p => p.stock < 20 && p.stock > 0).length;
		
		return [
			{ label: 'Live Products', value: String(liveCount), delta: '+2 this week', icon: Package, accent: 'text-red-400', border: 'border-red-700/60' },
			{ label: 'Drafts', value: String(draftCount), delta: 'Needs review', icon: Layers, accent: 'text-amber-300', border: 'border-amber-700/60' },
			{ label: 'Low Inventory', value: String(lowStockCount), delta: 'Restock soon', icon: AlertTriangle, accent: 'text-rose-300', border: 'border-red-700/60' },
		];
	}, [productList]);

	// Fetch products from backend
	React.useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('http://localhost/backend/admin/api/get-products.php');
				const result = await response.json();
				
				if (result.success) {
					setProductList(result.data);
					if (result.data.length > 0 && !stockForm.productId) {
						setStockForm(prev => ({ ...prev, productId: result.data[0].id }));
					}
				}
			} catch (error) {
				console.error('Failed to fetch products:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const selectedProduct = React.useMemo(
		() => productList.find((product) => product.id === stockForm.productId) ?? null,
		[stockForm.productId]
	);
	const currentStockLevel = selectedProduct?.stock ?? 0;
	const totalCost = React.useMemo(() => {
		if (stockForm.changeType !== 'IN') {
			return null;
		}
		const quantityNumber = Number(stockForm.quantity);
		const unitCostNumber = Number(stockForm.unitCost);
		if (!Number.isFinite(quantityNumber) || !Number.isFinite(unitCostNumber)) {
			return null;
		}
		if (quantityNumber <= 0 || unitCostNumber < 0) {
			return null;
		}
		return quantityNumber * unitCostNumber;
	}, [stockForm.changeType, stockForm.quantity, stockForm.unitCost]);
	const showUnitCostField = stockForm.changeType !== 'OUT';
	const unitCostIsRequired = stockForm.changeType === 'IN';
	const projectedStockLevel = React.useMemo(() => {
		const quantityNumber = Number(stockForm.quantity);
		if (!Number.isFinite(quantityNumber)) {
			return null;
		}
		if (stockForm.changeType === 'ADJUST') {
			return quantityNumber >= 0 ? quantityNumber : null;
		}
		if (quantityNumber <= 0) {
			return null;
		}
		if (stockForm.changeType === 'IN') {
			return currentStockLevel + quantityNumber;
		}
		if (stockForm.changeType === 'OUT') {
			return Math.max(currentStockLevel - quantityNumber, 0);
		}
		return null;
	}, [currentStockLevel, stockForm.changeType, stockForm.quantity]);

	const handleFileSelection = React.useCallback((file) => {
		setProductForm((prev) => {
			if (prev.imagePreview) {
				URL.revokeObjectURL(prev.imagePreview);
			}
			if (!file || !file.type?.startsWith('image/')) {
				return { ...prev, imageFile: null, imagePreview: '' };
			}
			const previewUrl = URL.createObjectURL(file);
			return { ...prev, imageFile: file, imagePreview: previewUrl };
		});
	}, []);

	const handleProductChange = (event) => {
		const { name, value } = event.target;
		if (name === 'price') {
			if (value === '.') {
				setProductForm((prev) => ({ ...prev, price: '0.' }));
				return;
			}
			if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
				setProductForm((prev) => ({ ...prev, price: value }));
			}
			return;
		}
		setProductForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleProductImageChange = (event) => {
		const file = event.target.files?.[0] ?? null;
		handleFileSelection(file);
		event.target.value = '';
	};

	const handleImageDragOver = (event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		if (!isImageDragging) {
			setIsImageDragging(true);
		}
	};

	const handleImageDragLeave = (event) => {
		event.preventDefault();
		if (event.currentTarget.contains(event.relatedTarget)) {
			return;
		}
		setIsImageDragging(false);
	};

	const handleImageDrop = (event) => {
		event.preventDefault();
		setIsImageDragging(false);
		const file = event.dataTransfer.files?.[0] ?? null;
		handleFileSelection(file);
	};

	React.useEffect(() => () => {
		if (productForm.imagePreview) {
			URL.revokeObjectURL(productForm.imagePreview);
		}
	}, [productForm.imagePreview]);

	const handleStockChange = (event) => {
		const { name, value } = event.target;
		if (stockError) {
			setStockError('');
		}
		if (name === 'changeType') {
			setStockForm((prev) => {
				const nextReference = generateReferenceByType(value);
				let nextNote = prev.note;
				let nextUnitCost = prev.unitCost;
				if (value === 'IN') {
					nextNote = generateAutoNoteText(prev.quantity);
					autoNoteRef.current = nextNote;
				} else {
					if (prev.note === autoNoteRef.current) {
						nextNote = '';
					}
					autoNoteRef.current = '';
					if (value === 'OUT') {
						nextUnitCost = '';
					}
				}
				return {
					...prev,
					changeType: value,
					unitCost: nextUnitCost,
					reference: nextReference,
					note: nextNote
				};
			});
			return;
		}
		if (name === 'quantity') {
			setStockForm((prev) => {
				let nextNote = prev.note;
				if (prev.changeType === 'IN') {
					const autoNote = generateAutoNoteText(value);
					if (prev.note === autoNoteRef.current || !prev.note) {
						nextNote = autoNote;
					}
					autoNoteRef.current = autoNote;
				}
				return { ...prev, quantity: value, note: prev.changeType === 'IN' ? nextNote : prev.note };
			});
			return;
		}
		if (name === 'productId') {
			setStockForm((prev) => ({
				...prev,
				productId: value,
				reference: generateReferenceByType(prev.changeType)
			}));
			return;
		}
		if (name === 'note') {
			autoNoteRef.current = value;
		}
		setStockForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleProductSubmit = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append('name', productForm.name);
			formData.append('sku', productForm.sku);
			formData.append('category', productForm.category);
			formData.append('status', productForm.status);
			formData.append('price', productForm.price);
			if (productForm.imageFile) {
				formData.append('image', productForm.imageFile);
			}
			let url, method;
			if (editingProductId) {
				// Edit mode
				formData.append('id', editingProductId);
				url = 'http://localhost/backend/admin/api/update-product.php';
				method = 'POST';
			} else {
				// Add mode
				url = 'http://localhost/backend/admin/api/add-product.php';
				method = 'POST';
			}
			const response = await fetch(url, {
				method,
				body: formData
			});
			const result = await response.json();
			if (result.success) {
				// Refresh product list
				const productsResponse = await fetch('http://localhost/backend/admin/api/get-products.php');
				const productsResult = await productsResponse.json();
				if (productsResult.success) {
					setProductList(productsResult.data);
				}
				// Reset form and close modal
				setProductForm({
					name: '',
					sku: '',
					category: '',
					status: 'Draft',
					price: '',
					imageFile: null,
					imagePreview: ''
				});
				setEditingProductId(null);
				setShowProductModal(false);
				alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
			} else {
				alert('Error: ' + result.error);
			}
		} catch (error) {
			console.error('Failed to save product:', error);
			alert('Failed to save product. Please try again.');
		}
	};

	const handleDeleteProduct = async (productId) => {
		const confirmed = window.confirm('Delete this product permanently?');
		if (!confirmed) return;
		try {
			const formData = new FormData();
			formData.append('id', productId);
			const response = await fetch('http://localhost/backend/admin/api/delete-product.php', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			if (result.success) {
				// Refresh list
				const productsResponse = await fetch('http://localhost/backend/admin/api/get-products.php');
				const productsResult = await productsResponse.json();
				if (productsResult.success) {
					setProductList(productsResult.data);
					setStockForm(prev => {
						if (String(prev.productId) === String(productId)) {
							return {
								...prev,
								productId: productsResult.data[0]?.id ?? '',
								reference: generateReferenceByType(prev.changeType)
							};
						}
						return prev;
					});
				}
				alert('Product deleted successfully!');
			} else {
				alert('Error: ' + (result.error || 'Failed to delete product'));
			}
		} catch (error) {
			console.error('Failed to delete product:', error);
			alert('Failed to delete product. Please try again.');
		}
	};

	const handleStockSubmit = async (event) => {
		event.preventDefault();
		const quantityNumber = Number(stockForm.quantity);
		const unitCostNumber = Number(stockForm.unitCost);
		if (!Number.isFinite(quantityNumber)) {
			setStockError('Please enter a valid quantity.');
			return;
		}
		if (quantityNumber < 0) {
			setStockError('Quantity cannot be negative.');
			return;
		}
		if (stockForm.changeType === 'IN') {
			if (quantityNumber <= 0) {
				setStockError('Incoming stock must be greater than zero.');
				return;
			}
			if (!Number.isFinite(unitCostNumber) || unitCostNumber <= 0) {
				setStockError('Please provide a unit cost greater than zero for incoming stock.');
				return;
			}
		}
		if (stockForm.changeType === 'OUT') {
			if (quantityNumber <= 0) {
				setStockError('Deduction must be greater than zero.');
				return;
			}
			if (quantityNumber > currentStockLevel) {
				setStockError('Deduction exceeds current stock.');
				return;
			}
		}
		if (stockForm.changeType === 'ADJUST' && stockForm.unitCost) {
			if (!Number.isFinite(unitCostNumber) || unitCostNumber < 0) {
				setStockError('Unit cost for adjustments must be zero or greater.');
				return;
			}
		}
		setStockError('');
		
		try {
			const response = await fetch('http://localhost/backend/admin/api/add-stock.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					productId: stockForm.productId,
					changeType: stockForm.changeType,
					quantity: quantityNumber,
					unitCost: stockForm.unitCost ? parseFloat(stockForm.unitCost) : null,
					reference: stockForm.reference,
					note: stockForm.note
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				// Refresh product list to show updated stock
				const productsResponse = await fetch('http://localhost/backend/admin/api/get-products.php');
				const productsResult = await productsResponse.json();
				
				if (productsResult.success) {
					setProductList(productsResult.data);
				}
				
				// Reset form and close modal
				setStockForm({
					productId: productList[0]?.id ?? '',
					changeType: 'IN',
					quantity: '',
					unitCost: '',
					reference: generateReferenceByType('IN'),
					note: ''
				});
				setShowStockModal(false);
				
				alert('Stock updated successfully!');
			} else {
				setStockError(result.error);
			}
		} catch (error) {
			console.error('Failed to update stock:', error);
			setStockError('Failed to update stock. Please try again.');
		}
	};

	const primaryActionLabel = React.useMemo(() => {
		if (productForm.status === 'Live') {
			return 'Save & Publish';
		}	
		return 'Save product';
	}, [productForm.status]);

	const imageMeta = React.useMemo(() => {
		if (!productForm.imageFile) {
			return '';
		}
		const sizeInMb = productForm.imageFile.size / (1024 * 1024);
		const displaySize = sizeInMb >= 1 ? `${sizeInMb.toFixed(2)} MB` : `${Math.round(productForm.imageFile.size / 1024)} KB`;
		return `${productForm.imageFile.name} · ${displaySize}`;
	}, [productForm.imageFile]);

	   return (
		   <div className="space-y-6">
			   {loading ? (
				   <div className="flex items-center justify-center py-20">
					   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
				   </div>
			   ) : (
				   <>
			   <section className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				   <div className="w-full lg:max-w-xl flex flex-col gap-3 sm:flex-row sm:items-center">
					   <div className="relative flex-1">
						   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
						   <input
							   type="text"
							   placeholder="Search products, SKUs or tags..."
							   className="w-full bg-gray-900/70 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						   />
					   </div>
					   <select
						   className="bg-gray-900/70 border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						   style={{ backgroundColor: '#0f141c', color: '#fff' }}
					   >
						   <option value="" style={{ backgroundColor: '#0f141c', color: '#fff' }}>All categories</option>
						   <option value="Hot Sauce" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Hot Sauce</option>
						   <option value="Specialty" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Specialty</option>
						   <option value="Limited" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Limited</option>
					   </select>
				   </div>
				   <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center justify-end">
					   <button
						   onClick={() => {
							   setEditingProductId(null);
							   setProductForm({
								   name: '',
								   sku: '',
								   category: '',
								   status: 'Draft',
								   price: '',
								   imageFile: null,
								   imagePreview: ''
							   });
							   setShowProductModal(true);
						   }}
						   className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl transition"
					   >
						   <Plus size={18} />
						   <span>Add Product</span>
					   </button>
					   <button
						   onClick={() => {
							   setShowStockModal(true);
						   }}
						   className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-3 rounded-xl transition border border-white/10 backdrop-blur-sm"
					   >
						   <PackagePlus size={18} />
						   <span>Update Stock</span>
					   </button>
				   </div>
			   </section>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{productSummary.map(({ label, value, delta, icon: Icon, accent, border }) => (
					<div key={label} className={`bg-gradient-to-br from-black/80 to-[#131822] border ${border} rounded-2xl p-5 shadow-lg flex flex-col gap-3`}>
						<span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/10 ${accent}`}>
							<Icon size={20} />
						</span>
						<div className="text-2xl font-bold text-white">{value}</div>
						<p className="text-sm text-white/70">{label}</p>
						<span className="text-xs text-white/50">{delta}</span>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<section className="xl:col-span-2 bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
						<h2 className="text-base md:text-lg font-bold text-white">Inventory</h2>
						<div className="flex flex-wrap gap-2">
							<button className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 text-xs font-semibold">All</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Live</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Draft</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Low stock</button>
						</div>
					</div>
					<div className="overflow-x-auto -mx-4 md:mx-0">
						<table className="min-w-full text-left text-sm text-white/90">
							<thead>
								<tr className="border-b border-gray-800/60 text-white/60">
									<th className="py-3 px-4 font-medium">Product</th>
									<th className="py-3 px-4 font-medium">Category</th>
									<th className="py-3 px-4 font-medium">Price</th>
									<th className="py-3 px-4 font-medium">Stock</th>
									<th className="py-3 px-4 font-medium">Status</th>
									<th className="py-3 px-4 font-medium">Updated</th>
									<th className="py-3 px-4 font-medium text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{productList.map((product) => {
									const badgeStyle = statusStyles[product.status] ?? statusStyles.default;
									return (
										<tr key={product.id} className="border-b border-gray-800/40 last:border-none">
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													{product.image ? (
														<img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-900/70 border border-gray-800" />
													) : (
														<div className="w-12 h-12 rounded-lg bg-gray-900/70 border border-gray-800 flex items-center justify-center">
															<Package size={20} className="text-white/40" />
														</div>
													)}
													<div>
														<p className="font-semibold text-white">{product.name}</p>
														<span className="text-xs text-white/50">{product.sku}</span>
													</div>
												</div>
											</td>
											<td className="py-3 px-4 text-white/70">{product.category}</td>
											<td className="py-3 px-4 text-white">Rs. {product.price.toLocaleString()}</td>
											<td className="py-3 px-4 text-white/80">{product.stock > 0 ? product.stock : '—'}</td>
											<td className="py-3 px-4">
												<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
													{product.status}
												</span>
											</td>
											<td className="py-3 px-4 text-white/60">{product.updated}</td>
											<td className="py-3 px-4">
												<div className="flex justify-end gap-2">
													<button
														className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1"
														onClick={() => {
															setEditingProductId(product.id);
															setProductForm({
																name: product.name || '',
																sku: product.sku || '',
																category: product.category || '',
																status: product.status || 'Draft',
																price: product.price ? String(product.price) : '',
																imageFile: null,
																imagePreview: product.image || ''
															});
															setShowProductModal(true);
														}}
													>
														<Edit size={14} />
														<span>Edit</span>
													</button>
													<button className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs flex items-center gap-1">
														<Trash2 size={14} />
														<span onClick={() => handleDeleteProduct(product.id)}>Delete</span>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>

				<aside className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 space-y-5">
					<h2 className="text-base md:text-lg font-bold text-white">Top performers</h2>
					<ul className="space-y-4">
						{topProducts.map((product) => (
							<li key={`${product.id}-highlight`} className="flex items-center gap-3">
								{product.image ? (
									<img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-gray-900/70 border border-gray-800" />
								) : (
									<div className="w-14 h-14 rounded-xl bg-gray-900/70 border border-gray-800 flex items-center justify-center">
										<Package size={24} className="text-white/40" />
									</div>
								)}
								<div className="flex-1">
									<p className="font-semibold text-white text-sm">{product.name}</p>
									<p className="text-xs text-white/50">{product.category}</p>
								</div>
								<span className="text-sm font-semibold text-white/90">{product.sales || 0} sold</span>
							</li>
						))}
					</ul>
					<div className="bg-red-600/15 rounded-xl p-4 border border-red-700/40 text-white/80 text-sm">
						Keep your catalogue fresh by updating photos, prices, and stock weekly.
					</div>
				</aside>
			</div>

			{showProductModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md">
					<div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f141c] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh]">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">{editingProductId ? 'Edit product' : 'Create product'}</p>
								<h3 className="mt-2 text-2xl font-semibold">{editingProductId ? 'Edit catalogue item' : 'Add a new catalogue item'}</h3>
								<p className="mt-1 text-sm text-white/60">Define pricing, availability, and stock thresholds for automatic alerts.</p>
							</div>
							<button
								onClick={() => {
									setShowProductModal(false);
									setEditingProductId(null);
								}}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition"
							>
								<X size={18} />
							</button>
						</div>

						<form className="space-y-6" onSubmit={handleProductSubmit}>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Product name</span>
									<input
										name="name"
										value={productForm.name}
										onChange={handleProductChange}
										placeholder="Classic Heat"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">SKU</span>
									<input
										name="sku"
										value={productForm.sku}
										onChange={handleProductChange}
										placeholder="CH-250"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Category</span>
									<input
										name="category"
										value={productForm.category}
										onChange={handleProductChange}
										placeholder="Hot Sauce"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Status</span>
									<select
										name="status"
										value={productForm.status}
										onChange={handleProductChange}
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
										style={{ backgroundColor: '#0f141c', color: '#fff' }}
									>
										{statusOptions.map((option) => (
											<option key={option} value={option} style={{ backgroundColor: '#0f141c', color: '#fff' }}>{option}</option>
										))}
									</select>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Price (Rs)</span>
									<input
										name="price"
										type="text"
										inputMode="decimal"
										value={productForm.price}
										onChange={handleProductChange}
										placeholder="1100"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70 sm:col-span-2">
									<span className="font-semibold text-white/80">Product image</span>
									<div
										className={`mt-2 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-6 text-center transition ${isImageDragging ? 'border-red-500 bg-red-600/10' : 'border-white/20 bg-white/5'}`}
										onDragOver={handleImageDragOver}
										onDragLeave={handleImageDragLeave}
										onDrop={handleImageDrop}
										role="presentation"
									>
										<input
											type="file"
											accept="image/*"
											ref={productImageInputRef}
											onChange={handleProductImageChange}
											className="hidden"
										/>
										{productForm.imagePreview ? (
											<div className="flex flex-col items-center gap-3">
												<div className="relative h-40 w-40 overflow-hidden rounded-xl border border-white/20 bg-black/40">
													<img src={productForm.imagePreview} alt="Preview" className="h-full w-full object-cover" />
												</div>
												{imageMeta && <span className="text-xs text-white/60">{imageMeta}</span>}
												<button
													type="button"
													onClick={() => productImageInputRef.current?.click()}
													className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
												>
													Replace image
												</button>
											</div>
										) : (
											<div className="flex flex-col items-center gap-3">
												<span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600/15 text-red-300">
													<ImagePlus size={22} />
												</span>
												<p className="text-sm font-semibold text-white/80">{isImageDragging ? 'Release to upload' : 'Drag & drop product image'}</p>
												<p className="text-xs text-white/60">or</p>
												<button
													type="button"
													onClick={() => productImageInputRef.current?.click()}
													className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
												>
													Browse files
												</button>
											</div>
										)}
										<p className="text-xs text-white/50">Recommended 1:1 • Up to 2 MB • We compress oversized uploads for faster checkout.</p>
									</div>
							</label>
						</div>

							<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
								<button
									type="button"
									onClick={() => setShowProductModal(false)}
									className="w-full sm:w-auto rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 hover:text-white"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
								>
									{primaryActionLabel}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showStockModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md">
					<div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111722] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh]">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">Adjust stock</p>
								<h3 className="mt-2 text-2xl font-semibold">Log an inventory movement</h3>
								<p className="mt-1 text-sm text-white/60">Record restocks, deductions, or manual corrections for full audit trails.</p>
							</div>
							<button
								onClick={() => setShowStockModal(false)}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition"
							>
								<X size={18} />
							</button>
						</div>

						<form className="space-y-6" onSubmit={handleStockSubmit}>
							{stockError && (
								<div className="rounded-2xl border border-red-500/40 bg-red-600/15 px-4 py-3 text-sm text-red-200">
									{stockError}
								</div>
							)}
							<label className="flex flex-col text-sm text-white/70">
								<span className="font-semibold text-white/80">Product</span>
								<select
									name="productId"
									value={stockForm.productId}
									onChange={handleStockChange}
									className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
									style={{ backgroundColor: '#111722', color: '#fff' }}
									required
								>
									{productList.map((product) => (
										<option key={product.id} value={product.id} style={{ backgroundColor: '#111722', color: '#fff' }}>
											{product.name} ({product.sku})
										</option>
									))}
								</select>
								<span className="mt-2 text-xs text-white/60">Current stock: {currentStockLevel.toLocaleString()} units</span>
							</label>

							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Movement type</span>
									<div className="mt-2 grid gap-2">
										{changeTypes.map(({ value, label }) => {
											const isActive = stockForm.changeType === value;
											const visuals = movementVisuals[value] ?? movementVisuals.ADJUST;
											return (
												<label
													key={value}
													className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive ? visuals.active : visuals.idle}`}
												>
													<input
														type="radio"
														name="changeType"
														value={value}
														className="sr-only"
														checked={isActive}
														onChange={handleStockChange}
													/>
													<div className="flex items-center gap-2">
														<span className={`h-2.5 w-2.5 rounded-full ${visuals.dot}`} />
														<span className={isActive ? 'font-semibold text-white' : 'text-white/80'}>{label}</span>
													</div>
												</label>
											);
										})}
									</div>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Quantity</span>
									<input
										name="quantity"
										type="number"
										min={stockForm.changeType === 'ADJUST' ? '0' : '1'}
										value={stockForm.quantity}
										onChange={handleStockChange}
										placeholder={stockForm.changeType === 'ADJUST' ? 'Target count' : '24'}
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
							</div>

							<div
								className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
									projectedStockLevel ? movementPanels[stockForm.changeType] ?? 'border-white/10 bg-white/5 text-white/70' : 'border-white/10 bg-white/5 text-white/60'
								}`}
							>
								<div className="space-y-1">
									<span className="font-medium text-white">Projected stock after change</span>
									<p className="text-xs text-white/60">
										{stockForm.changeType === 'IN' && 'Current stock plus incoming quantity.'}
										{stockForm.changeType === 'OUT' && 'Reflects deduction from current stock.'}
										{stockForm.changeType === 'ADJUST' && 'Sets stock level directly to the amount you specify.'}
									</p>
								</div>
								<span className="text-sm font-semibold text-white">
									{projectedStockLevel !== null ? `${projectedStockLevel.toLocaleString()} units` : 'Add a quantity to preview'}
								</span>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Reference</span>
									<input
										name="reference"
										value={stockForm.reference}
										onChange={handleStockChange}
										placeholder="PO-2025-11-09"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
								{showUnitCostField && (
									<label className="flex flex-col text-sm text-white/70">
										<span className="font-semibold text-white/80">
											Unit cost (Rs)
											{!unitCostIsRequired && <span className="text-white/40"> &middot; optional</span>}
										</span>
										<input
											name="unitCost"
											type="number"
											min="0"
											value={stockForm.unitCost}
											onChange={handleStockChange}
											placeholder="450"
											className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
											required={unitCostIsRequired}
										/>
										{unitCostIsRequired ? (
											<span className="mt-2 text-xs text-white/50">Required for incoming stock to capture landed cost.</span>
										) : (
											<span className="mt-2 text-xs text-white/50">Include a cost for audit notes when adjusting counts.</span>
										)}
									</label>
								)}
							</div>

							{stockForm.changeType === 'IN' && (
								<div
									className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
										totalCost ? 'border-green-500/50 bg-green-600/15 text-green-100 shadow-[0_0_18px_rgba(34,197,94,0.25)]' : 'border-white/10 bg-white/5 text-white/60'
									}`}
								>
									<span className="font-medium">Estimated total cost</span>
									<span className={`font-semibold ${totalCost ? 'text-white' : 'text-white/70'}`}>
										{totalCost ? `Rs. ${totalCost.toLocaleString()}` : 'Add quantity & unit cost'}
									</span>
								</div>
							)}

							<label className="flex flex-col text-sm text-white/70">
								<span className="font-semibold text-white/80">Notes</span>
								<textarea
									name="note"
									value={stockForm.note}
									onChange={handleStockChange}
									rows={3}
									placeholder="Batch #2025-11 restock"
									className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
								/>
							</label>

							<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
								<button
									type="button"
									onClick={() => setShowStockModal(false)}
									className="w-full sm:w-auto rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 hover:text-white"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
								>
									Log stock change
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			</>
			)}
		</div>
	);
};

export default ProductDetails;
