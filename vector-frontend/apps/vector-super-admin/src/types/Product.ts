// ----------------- Shared Fields -----------------
interface BaseProduct {
	_id: string
	productName: string
	productDescription: string
	brand: {
		_id: string
		brandName: string
		tagline?: string
		description?: string
		termsAndConditions?: string
		logo?: string
		status?: string
	}
	category: {
		_id: string
		name: string
		type: string
		description?: string
		image?: string
	}

	barcode?: string
	tags: string[]
	discountPercent?: number | null
	taxRate?: number | null

	productStatus: 'draft' | 'published' | 'archived'
	visibility: 'visible' | 'hidden'

	isFeatured: boolean
	isFragile: boolean
	isPreOrder: boolean

	availableQuantity?: number | null
	minimumQuantity?: number | null
	reorderQuantity?: number | null
	maximumQuantity?: number | null

	weight?: number | null
	dimensions: {
		length: number | null
		width: number | null
		height: number | null
	}

	shippingClass?: string
	packageType?: string
	quantityPerBox?: number | null

	supplierId?: string
	affiliateId?: string
	externalLinks: string[]

	metaTitle?: string
	metaDescription?: string
	urlSlug: string

	viewsCount: number
	wishlistCount: number
	orderCount: number
	addedToCartCount: number

	createdAt: string
	updatedAt: string
}

// ----------------- Non-Variant Product -----------------
export interface SimpleProduct extends BaseProduct {
	hasVariant: false
	SKU: string
	costPrice: number
	sellingPrice: number
	mrpPrice: number
	productImages: string[] // ✅ product-level field
}

// ----------------- Variant Product -----------------
export interface Variant {
	_id: string
	productId: string
	SKU: string
	barcode?: string
	variantAttributes: {
		attribute: string
		value: string
	}[]
	costPrice?: number
	sellingPrice?: number
	mrpPrice?: number
	availableQuantity?: number | null
	minimumQuantity?: number | null
	images?: string[] // ✅ variant-level field is `images`
}

export interface VariantProduct extends BaseProduct {
	hasVariant: true
	productType: string
	defaultVariant: Variant
	productImages: string[] // could be empty at product level
}

// ----------------- Union Type -----------------
export type Product = SimpleProduct | VariantProduct
