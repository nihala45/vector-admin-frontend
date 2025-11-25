export interface Brand {
	_id: string
	brandName: string
	tagline?: string
	description?: string
	termsAndConditions: string
	status: 'active' | 'inactive'
	imageUrl: string
	createdAt: string
	updatedAt: string
}

export interface BrandFormValues {
	brandName: string
	tagline?: string
	description?: string
	termsAndConditions: string
	status: 'active' | 'inactive'
	imageUrl: string
}
