export interface Category {
	_id: string
	type: 'Main' | 'Sub'
	image: string
	name: string
	description?: string
	parentId?: string | null
	categoryCode: string
	subcategories:any;
	status: 'active' | 'inactive'
	createdAt: string
	updatedAt: string
}

export interface CategoryFormValues {
	type: 'Main' | 'Sub'
	image: string
	name: string
	description?: string
	parentId?: string | null
	categoryCode: string
	status: 'active' | 'inactive'
}
